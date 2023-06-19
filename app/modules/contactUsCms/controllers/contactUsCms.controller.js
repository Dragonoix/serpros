const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactUsCms = require('contactUsCms/repositories/contactUsCms.repository');

class ContactUsCmsController {
    constructor () {
        this.availContactUsCms();
    }

    /*  @Method: availContactUsCms
        @Description: site contactUsCms schema create
    */
    async availContactUsCms () {
        try {
            let contactUsCmsAvail = await contactUsCms.getByField({isDeleted: false});
            if (!contactUsCmsAvail) {
                contactUsCms.save();
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
            let contactUsCmsAvail = await contactUsCms.getByField({isDeleted: false});
            res.render('contactUsCms/views/edit.ejs', {
                page_name: 'contactUsCms-management',
                page_title: 'Edit Contact Us Cms',
                user: req.user,
                response: contactUsCmsAvail
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
            
            let contactUsCmsAvail = await contactUsCms.getByField({isDeleted: false});
            // console.log(req.files);
            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'icon1') {
                            req.body.icon1 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'icon2') {
                            req.body.icon2 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'icon3') {
                            req.body.icon3 = req.files[i].filename;
                        }
                    }

                }
            }
            
            // console.log(req.body);
            if (contactUsCmsAvail) {
                let update = await contactUsCms.updateById(req.body, contactUsCmsAvail._id);
                if (update && update._id) {
                    req.flash("success", "Contact Us Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("contactUsCms.edit"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('contactUsCms.edit'));
        }
    };
};

module.exports = new ContactUsCmsController();