const express = require('express');
const mongoose = require('mongoose');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const transactionRepo = require('transaction/repositories/transaction.repository');

class TransactionUsController {

        /*
            @Method: list
            @Description: Listing The Transaction Us List Page
        */

        async list(req, res){
            try {
                let status = '';
                if (req.query.status) {
                    status = req.query.status;
                }
    
                let data = await transactionRepo.getStats(req);
                res.render('transaction/views/list', {
                    page_name: 'transaction',
                    page_title: 'Transaction History',
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
            @Description: Get All Transaction Us List
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
                let transactionData = await transactionRepo.getAll(req);
                let data = {
                    "recordsTotal": transactionData.total,
                    "recordsFiltered": transactionData.total,
                    "data": transactionData.docs
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
            let data = await transactionRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await transactionRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("transaction.list"));
            }
            else{
                req.flash("error", "Unable to change status");
                res.redirect(namedRouter.urlFor("transaction.list"));
            }

        } catch (err) {
            console.log(err);
            // throw err;
            req.flash("error", "Unable to change status");
            res.redirect(namedRouter.urlFor("transaction.list"));
        }
    };

    /**
     * @Method delete
     * @Description Delete Data
    */
    async delete(req, res) {
        try {
            let transactionDeleteData = await transactionRepo.getById(req.params.id);
            if (!_.isEmpty(transactionDeleteData)) {
                let transactionDelete = await transactionRepo.updateById({ "isDeleted": true }, transactionDeleteData._id)
                if (!_.isEmpty(transactionDelete) && transactionDelete._id) {
                    req.flash('success', 'Transaction Us Deleted Successfully');
                    res.redirect(namedRouter.urlFor('transaction.list'));
                } else {
                    req.flash('error', "Sorry Transaction Us Not Deleted");
                    res.redirect(namedRouter.urlFor('transaction.list'));
                }
            } else {
                req.flash('error', "Sorry Transaction Us not found");
                res.redirect(namedRouter.urlFor('transaction.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    async detail (req, res) {
        try {
            let transactionAvail = await transactionRepo.getByIdCustom(req.params.id);
            // console.log(transactionAvail);
            if(!_.isEmpty(transactionAvail) && transactionAvail._id) {
                res.render('transaction/views/details.ejs', {
                    page_name: 'transaction',
                    page_title: 'Transaction Details',
                    user: req.user,
                    response: transactionAvail
                });
            } else {
                req.flash("error", 'Sorry, Data not found');
                res.redirect(namedRouter.urlFor('transaction.list'));
            }
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('transaction.list'));
        }
    };
}

module.exports = new TransactionUsController();