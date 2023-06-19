const express = require('express');
const mongoose = require('mongoose');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const contactUsRepo = require('contactUs/repositories/contactUs.repository');

class ContactUsController {

        /*
            @Method: list
            @Description: Listing The Contact Us List Page
        */

        async list(req, res){
            try {
                let status = '';
                if (req.query.status) {
                    status = req.query.status;
                }
    
                let data = await contactUsRepo.getStats(req);
                res.render('contactUs/views/list', {
                    page_name: 'contact-us',
                    page_title: 'Contact Us',
                    user: req.user,
                    status,
                    data
                })
            } catch (err) {
                console.log(err);
                throw err;
            }
        }

        /*  
            @Method: getAll
            @Description: Get All Contact Us List
        */

        async getAll(req, res) {
            try {
                let start = parseInt(req.body.start);
                let length = parseInt(req.body.length);
                let currentPage = 1;
                if (start > 0) {
                    currentPage = parseInt((start + length) / length);
                }
                req.body.page = currentPage;
                let contactUsData = await contactUsRepo.getAll(req);
                let data = {
                    "recordsTotal": contactUsData.total,
                    "recordsFiltered": contactUsData.total,
                    "data": contactUsData.docs
                };
                return {
                    status: 200,
                    data: data,
                    message: `Data fetched successfully.`
                };
            } catch (err) {
                return {
                    status: 500,
                    data: [],
                    message: err.message
                };
            }
        }

        /**
     * @Method statusChange
     * @Description To Change The Status
    */
    async statusChange(req, res) {
        try {
            let data = await contactUsRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await contactUsRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("contact-us.list"));
            }
            else{
                req.flash("error", "Unable to change status");
                res.redirect(namedRouter.urlFor("contact-us.list"));
            }

        } catch (err) {
            console.log(err);
            // throw err;
            req.flash("error", "Unable to change status");
            res.redirect(namedRouter.urlFor("contact-us.list"));
        }
    };

    /**
     * @Method delete
     * @Description Delete Data
    */
    async delete(req, res) {
        try {
            let contactUsDeleteData = await contactUsRepo.getById(req.params.id);
            if (!_.isEmpty(contactUsDeleteData)) {
                let contactUsDelete = await contactUsRepo.updateById({ "isDeleted": true }, contactUsDeleteData._id)
                if (!_.isEmpty(contactUsDelete) && contactUsDelete._id) {
                    req.flash('success', 'Contact Us Deleted Successfully');
                    res.redirect(namedRouter.urlFor('contact-us.list'));
                } else {
                    req.flash('error', "Sorry Contact Us Not Deleted");
                    res.redirect(namedRouter.urlFor('contact-us.list'));
                }
            } else {
                req.flash('error', "Sorry Contact Us not found");
                res.redirect(namedRouter.urlFor('contact-us.list'));
            }
        } catch (err) {
            throw err;
        }
    };


    async detail (req, res) {
        try {
            let contactDetails = await contactUsRepo.getById(req.params.id);
            
            res.render('contactUs/views/details.ejs', {
                page_name: 'Contact Us',
                page_title: 'Contact Us Details',
                user: req.user,
                response: contactDetails
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };

}

module.exports = new ContactUsController();