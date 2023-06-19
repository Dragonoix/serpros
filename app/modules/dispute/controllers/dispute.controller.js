const express = require('express');
const mongoose = require('mongoose');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const disputeRepo = require('dispute/repositories/dispute.repository');

class DisputeUsController {

    /*
        @Method: list
        @Description: Listing The Dispute Us List Page
    */

    async list(req, res) {

        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await disputeRepo.getStats(req);
            res.render('dispute/views/list', {
                page_name: 'dispute',
                page_title: 'Dispute History',
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
        @Description: Get All Dispute Us List
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
            let disputeData = await disputeRepo.getAll(req);
            let data = {
                "recordsTotal": disputeData.total,
                "recordsFiltered": disputeData.total,
                "data": disputeData.docs
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
            let data = await disputeRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await disputeRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("dispute.list"));
            }
            else {
                req.flash("error", "Unable to change status");
                res.redirect(namedRouter.urlFor("dispute.list"));
            }

        } catch (err) {
            console.log(err);
            // throw err;
            req.flash("error", "Unable to change status");
            res.redirect(namedRouter.urlFor("dispute.list"));
        }
    };

    /**
     * @Method delete
     * @Description Delete Data
    */
    async delete(req, res) {
        try {
            let disputeDeleteData = await disputeRepo.getById(req.params.id);
            if (!_.isEmpty(disputeDeleteData)) {
                let disputeDelete = await disputeRepo.updateById({ "isDeleted": true }, disputeDeleteData._id)
                if (!_.isEmpty(disputeDelete) && disputeDelete._id) {
                    req.flash('success', 'Dispute Us Deleted Successfully');
                    res.redirect(namedRouter.urlFor('dispute.list'));
                } else {
                    req.flash('error', "Sorry Dispute Us Not Deleted");
                    res.redirect(namedRouter.urlFor('dispute.list'));
                }
            } else {
                req.flash('error', "Sorry Dispute Us not found");
                res.redirect(namedRouter.urlFor('dispute.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    async detail(req, res) {
        try {
            let overallRating = 0;
            let disputeAvail = await disputeRepo.getByIdCustom(req.params.id);
            if (!_.isEmpty(disputeAvail) && disputeAvail._id) {
                let ratingSum = (parseFloat(disputeAvail['workmanship']['rating']) + parseFloat(disputeAvail['cost']['rating']) + parseFloat(disputeAvail['schedule']['rating']) + parseFloat(disputeAvail['communication']['rating'])) / 4;
                overallRating = Math.round(ratingSum * 10) / 10
            }


            res.render('dispute/views/details.ejs', {
                page_name: 'dispute',
                page_title: 'Dispute Details',
                user: req.user,
                response: disputeAvail,
                overallRating
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };
}

module.exports = new DisputeUsController();