const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const priceFilterMasterRepo = require('priceFilterMaster/repositories/priceFilterMaster.repository');
const mongoose = require('mongoose');
class priceFilterMasterController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The priceFilterMaster Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await priceFilterMasterRepo.getStats(req);
            res.render('priceFilterMaster/views/list', {
                page_name: 'priceFilterMaster',
                page_title: 'Price Filter Master List',
                user: req.user,
                status,
                data
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method getAll
     * @Description Get All PriceFilterMaster
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
            let priceFilterMasterData = await priceFilterMasterRepo.getAll(req);
            let data = {
                "recordsTotal": priceFilterMasterData.total,
                "recordsFiltered": priceFilterMasterData.total,
                "data": priceFilterMasterData.docs
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
    };

    /**
     * @Method create
     * @Description To Show The Add PriceFilterMaster Form
    */
    async create(req, res) {
        try {
            res.render('priceFilterMaster/views/add', {
                page_name: 'priceFilterMaster',
                page_title: 'PriceFilterMaster Add',
                user: req.user,
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method insert
     * @Description To Insert PriceFilterMaster Data To Collection
    */
   
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            let greater_than;
            req.body.greater_than = req.body.greater_than;
            // console.log("your log --->",greater_than);
            if (_.isEmpty(req.body.greater_than)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('priceFilterMaster.create'));
            } else {
                    let saveData = await priceFilterMasterRepo.save(req.body);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'PriceFilterMaster Added Successfully!');
                        res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
                    } else {
                        req.flash('error', 'PriceFilterMaster Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('priceFilterMaster.create'));
                    }

            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method edit
     * @Description To Show The Edit Form
    */
    async edit(req, res) {
        try {
            let priceFilterMasterData = await priceFilterMasterRepo.getById(req.params.id);
            if (!_.isEmpty(priceFilterMasterData)) {
                res.render('priceFilterMaster/views/edit', {
                    page_name: 'priceFilterMaster',
                    page_title: 'PriceFilterMaster Edit',
                    user: req.user,
                    response: priceFilterMasterData,
                })
            } else {
                req.flash('error', 'PriceFilterMaster Not Found!');
                res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method update
     * @Description To Update Data
    */
    async update(req, res) {
        try {
            // console.log(req.body);
            req.body.greater_than = req.body.greater_than;
            if (_.isEmpty(req.body.greater_than)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
            } else {
                const priceFilterMasterId = req.body.id;                         
                    let priceFilterMasterUpdate = await priceFilterMasterRepo.updateById(req.body, priceFilterMasterId);
                    if (!_.isEmpty(priceFilterMasterUpdate) && priceFilterMasterUpdate._id) {
                        req.flash('success', "PriceFilterMaster Updated Successfully");
                        res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
                    } else {
                        req.flash('error', "PriceFilterMaster Failed To Update!");
                        res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
                    }
                         
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    /**
     * @Method statusChange
     * @Description To Change The Status
    */
    async statusChange(req, res) {
        try {
            let data = await priceFilterMasterRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await priceFilterMasterRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("priceFilterMaster.list"));
            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    /**
     * @Method delete
     * @Description Delete Data
    */
    async delete(req, res) {
        try {
            let priceFilterMasterDeleteData = await priceFilterMasterRepo.getById(req.params.id);
            if (!_.isEmpty(priceFilterMasterDeleteData)) {
                let priceFilterMasterDelete = await priceFilterMasterRepo.updateById({ "isDeleted": true }, priceFilterMasterDeleteData._id)
                if (!_.isEmpty(priceFilterMasterDelete) && priceFilterMasterDelete._id) {
                    req.flash('success', 'priceFilterMaster Deleted Successfully');
                    res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
                } else {
                    req.flash('error', "Sorry priceFilterMaster Not Deleted");
                    res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
                }
            } else {
                req.flash('error', "Sorry priceFilterMaster not found");
                res.redirect(namedRouter.urlFor('priceFilterMaster.list'));
            }
        } catch (err) {
            throw err;
        }
    };

}

module.exports = new priceFilterMasterController();