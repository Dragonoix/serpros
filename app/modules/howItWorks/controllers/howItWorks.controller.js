const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const howItWorksRepo = require('howItWorks/repositories/howItWorks.repository');

class HowItWorksController {
    constructor () {
        this.availHowItWorks();
    }

    /*  @Method: availHowItWorks
        @Description: site howItWorks schema create
    */
    async availHowItWorks () {
        try {
            let howItWorksAvail = await howItWorksRepo.getByField({isDeleted: false});
            if (!howItWorksAvail) {
                howItWorksRepo.save();
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
            let howItWorksAvail = await howItWorksRepo.getByField({isDeleted: false});
            res.render('howItWorks/views/edit.ejs', {
                page_name: 'howItWorks-management',
                page_title: 'Edit How It Works',
                user: req.user,
                response: howItWorksAvail
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
            
            let howItWorksAvail = await howItWorksRepo.getByField({isDeleted: false});
            // console.log(req.files);
            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'image1') {
                            req.body.image1 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'image2') {
                            req.body.image2 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'image3') {
                            req.body.image3 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'side_image') {
                            req.body.side_image = req.files[i].filename;
                        }
                    }

                }
            }
            
            // console.log(req.body);
            if (howItWorksAvail) {
                let update = await howItWorksRepo.updateById(req.body, howItWorksAvail._id);
                if (update && update._id) {
                    req.flash("success", "How It Works Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("howItWorks.edit"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('howItWorks.edit'));
        }
    };
};

module.exports = new HowItWorksController();