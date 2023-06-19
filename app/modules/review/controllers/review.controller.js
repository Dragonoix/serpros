const express = require('express');
const mongoose = require('mongoose');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const reviewRepo = require('review/repositories/review.repository');

class ReviewUsController {

    /*
        @Method: list
        @Description: Listing The Review Us List Page
    */

    async list(req, res) {

        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await reviewRepo.getStats(req);
            res.render('review/views/list', {
                page_name: 'review',
                page_title: 'Review History',
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
        @Description: Get All Review Us List
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
            let reviewData = await reviewRepo.getAll(req);
            let data = {
                "recordsTotal": reviewData.total,
                "recordsFiltered": reviewData.total,
                "data": reviewData.docs
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
            let data = await reviewRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await reviewRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("review.list"));
            }
            else {
                req.flash("error", "Unable to change status");
                res.redirect(namedRouter.urlFor("review.list"));
            }

        } catch (err) {
            console.log(err);
            // throw err;
            req.flash("error", "Unable to change status");
            res.redirect(namedRouter.urlFor("review.list"));
        }
    };

    /**
     * @Method delete
     * @Description Delete Data
    */
    async delete(req, res) {
        try {
            let reviewDeleteData = await reviewRepo.getById(req.params.id);
            if (!_.isEmpty(reviewDeleteData)) {
                let reviewDelete = await reviewRepo.updateById({ "isDeleted": true }, reviewDeleteData._id)
                if (!_.isEmpty(reviewDelete) && reviewDelete._id) {
                    req.flash('success', 'Review Us Deleted Successfully');
                    res.redirect(namedRouter.urlFor('review.list'));
                } else {
                    req.flash('error', "Sorry Review Us Not Deleted");
                    res.redirect(namedRouter.urlFor('review.list'));
                }
            } else {
                req.flash('error', "Sorry Review Us not found");
                res.redirect(namedRouter.urlFor('review.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    async detail(req, res) {
        try {
            let overallRating = 0;
            let reviewAvail = await reviewRepo.getByIdCustom(req.params.id);
            console.log(reviewAvail,'-----reviewAvail');
            
            if (!_.isEmpty(reviewAvail) && reviewAvail._id) {
                let ratingSum = (parseFloat(reviewAvail['workmanship']['rating']) + parseFloat(reviewAvail['cost']['rating']) + parseFloat(reviewAvail['schedule']['rating']) + parseFloat(reviewAvail['communication']['rating'])) / 4;
                overallRating = Math.round(ratingSum * 10) / 10
            }


            res.render('review/views/details.ejs', {
                page_name: 'review',
                page_title: 'Review Details',
                user: req.user,
                response: reviewAvail,
                overallRating
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };
}

module.exports = new ReviewUsController();