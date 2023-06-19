const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const footerCmsRepo = require('footerCms/repositories/footerCms.repository');

class FooterCmsController {
    constructor () {
        this.availFooterCms();
    }

    /*  @Method: availFooterCms
        @Description: site footerCms schema create
    */
    async availFooterCms () {
        try {
            let footerCmsAvail = await footerCmsRepo.getByField({isDeleted: false});
            if (!footerCmsAvail) {
                footerCmsRepo.save();
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
            let footerCmsAvail = await footerCmsRepo.getByField({isDeleted: false});
            res.render('footerCms/views/edit.ejs', {
                page_name: 'footerCms-management',
                page_title: 'Edit Footer Cms',
                user: req.user,
                response: footerCmsAvail
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
            
            let footerCmsAvail = await footerCmsRepo.getByField({isDeleted: false});
            // console.log(req.files);
            
            
            // console.log(req.body);
            if (footerCmsAvail) {
                let update = await footerCmsRepo.updateById(req.body, footerCmsAvail._id);
                if (update && update._id) {
                    req.flash("success", "Footer Cms Updated Successfully!");
                } else {
                    req.flash("error", "Something went wrong!");
                }
            } else {
                req.flash("error", "Something went wrong!");
            }

            res.redirect(namedRouter.urlFor("footerCms.edit"));
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('footerCms.edit'));
        }
    };
};

module.exports = new FooterCmsController();