const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const subscriptionPlanRepo = require('subscriptionPlan/repositories/subscriptionPlan.repository');

class SubscriptionPlanController {
    constructor () {
        this.availSubscriptionPlan();
    }

    /*  @Method: availSubscriptionPlan
        @Description: site subscriptionPlan schema create
    */
    async availSubscriptionPlan () {
        try {
            let subscriptionPlanAvail = await subscriptionPlanRepo.getByField({isDeleted: false});
            if (!subscriptionPlanAvail) {
                subscriptionPlanRepo.save();
            }

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    /*  @Method: edit
        @Description: admin theme color schema edit view render
    */
    async edit (req, res) {
        try {
            let subscriptionPlanAvail = await subscriptionPlanRepo.getByField({isDeleted: false});

            res.render('subscriptionPlan/views/edit.ejs', {
                page_name: 'subscriptionPlan',
                page_title: 'Edit Subscription Plan',
                user: req.user,
                response: subscriptionPlanAvail
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };

    /*  @Method: update
        @Description: admin theme color schema update
    */
    async update (req, res) {
        try {
            
            let subscriptionPlanAvail = await subscriptionPlanRepo.getByField({isDeleted: false});
            // console.log(req.files);
            
            
            // console.log(req.body);
            if (subscriptionPlanAvail) {
                let update = await subscriptionPlanRepo.updateById(req.body, subscriptionPlanAvail._id);
                if (update && update._id) {
                    req.flash("success", "Plan Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("subscriptionPlan.edit"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('subscriptionPlan.edit'));
        }
    };
};

module.exports = new SubscriptionPlanController();