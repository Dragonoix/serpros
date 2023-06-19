const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const settingsRepo = require('settings/repositories/settings.repository');
const stripe = require("../../../helper/stripePayment");

class SettingsController {
    constructor () {
        this.availSetting();
    }

    /*  @Method: availSetting
        @Description: site setting schema create
    */
    async availSetting () {
        try {
            let settingsAvail = await settingsRepo.getByField({isDeleted: false});
            if (!settingsAvail) {
                settingsRepo.save();
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
            let settingsAvail = await settingsRepo.getByField({isDeleted: false});
            res.render('settings/views/edit.ejs', {
                page_name: 'settings-management',
                page_title: 'Charges & Tax',
                user: req.user,
                response: settingsAvail
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
            let settingsAvail = await settingsRepo.getByField({isDeleted: false});
            if (settingsAvail) {
                if (_.has(req.body, "tax_percent")) {
                    let taxData = await  stripe.createTax(req.body.tax_percent);
                    if(_.has(taxData, "id")) {
                        req.body.stripe_tax_charge_id = taxData.id;
                    }
                }
                let update = await settingsRepo.updateById(req.body, settingsAvail._id);
                if (update && update._id) {
                    req.flash("success", "Site Settings Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("user.dashboard"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };
};

module.exports = new SettingsController();