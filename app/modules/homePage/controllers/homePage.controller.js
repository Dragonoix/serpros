const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const homePageRepo = require('homePage/repositories/homePage.repository');

class HomePageController {
    constructor () {
        this.availHomePage();
    }

    /*  @Method: availHomePage
        @Description: site homePage schema create
    */
    async availHomePage () {
        try {
            let homePageAvail = await homePageRepo.getByField({isDeleted: false});
            if (!homePageAvail) {
                homePageRepo.save();
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
            let homePageAvail = await homePageRepo.getByField({isDeleted: false});
            res.render('homePage/views/edit.ejs', {
                page_name: 'homePage-management',
                page_title: 'Edit Home Page Cms',
                user: req.user,
                response: homePageAvail
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
            
            let homePageAvail = await homePageRepo.getByField({isDeleted: false});
            let bannerArr = [];
            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'banner') {
                            bannerArr.push(req.files[i].filename);
                            
                        }
                        
                        if (req.files[i].fieldname == 'sec1_banner') {
                            req.body.sec1_banner = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'sec1_icon1') {
                            req.body.sec1_icon1 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'sec1_icon2') {
                            req.body.sec1_icon2 = req.files[i].filename;
                        }

                        if (req.files[i].fieldname == 'sec1_icon3') {
                            req.body.sec1_icon3 = req.files[i].filename;
                        }
                    }
                    req.body.banner = bannerArr;

                }
            }
            
            // console.log(req.body);
            if (homePageAvail) {
                let update = await homePageRepo.updateById(req.body, homePageAvail._id);
                if (update && update._id) {
                    req.flash("success", "Home Page Cms Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("homePage.edit"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('homePage.edit'));
        }
    };
};

module.exports = new HomePageController();