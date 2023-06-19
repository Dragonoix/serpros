const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const cityRepo = require('city/repositories/city.repository');
const regionRepo = require('region/repositories/region.repository');
const suburbRepo = require('suburb/repositories/suburb.repository');

const mongoose = require('mongoose');
class suburbController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The suburb Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await suburbRepo.getStats(req);
            res.render('suburb/views/list', {
                page_name: 'suburb',
                page_title: 'Suburb List',
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
     * @Description Get All suburb
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
            let suburbData = await suburbRepo.getAll(req);
            let data = {
                "recordsTotal": suburbData.total,
                "recordsFiltered": suburbData.total,
                "data": suburbData.docs
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
     * @Description To Show The Add FAQ Form
    */
    async create(req, res) {
        try {
            let allRegions = await regionRepo.getAllByField({
                isDeleted: false,
                status: 'Active'
            });
            res.render('suburb/views/add', {
                page_name: 'suburb',
                page_title: 'Suburb Add',
                user: req.user,
                allRegions
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method insert
     * @Description To Insert Suburb Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            req.body.suburbName = req.body.suburbName.trim();
            if (_.isEmpty(req.body.suburbName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('suburb.create'));
            } else {
                let isSuburbExists = await suburbRepo.getByField({ 'suburbName': { $regex: "^" + req.body.suburbName.trim() + "$", $options: "i" }, isDeleted: false });
                if (!_.isEmpty(isSuburbExists)) {
                    req.flash('error', 'Suburb Already Exists!');
                    res.redirect(namedRouter.urlFor('suburb.create'));
                } else {
                    let saveData = await suburbRepo.save(req.body);
                    console.log(saveData);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'Suburb Added Successfully!');
                        res.redirect(namedRouter.urlFor('suburb.list'));
                    } else {
                        req.flash('error', 'Suburb Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('suburb.create'));
                    }
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
            let allRegions = await regionRepo.getAllByField({
                isDeleted: false,
                status: 'Active'
            });
            let suburbData = await suburbRepo.getById(req.params.id);
            let allCities = await cityRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                region: suburbData.region
            });
            if (!_.isEmpty(suburbData)) {
                res.render('suburb/views/edit', {
                    page_name: 'suburb',
                    page_title: 'Suburb Edit',
                    user: req.user,
                    response: suburbData,
                    allRegions,
                    allCities
                })
            } else {
                req.flash('error', 'Suburb Not Found!');
                res.redirect(namedRouter.urlFor('suburb.list'));
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
            req.body.suburbName = req.body.suburbName.trim();
            if (_.isEmpty(req.body.suburbName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('suburb.list'));
            } else {
                const suburbId = req.body.id;
                let isSuburbExists = await suburbRepo.getByField({ 'suburbName': { $regex: "^" + req.body.suburbName.trim() + "$", $options: "i" }, _id: { $ne: suburbId }, isDeleted: false });
                if (!_.isEmpty(isSuburbExists)) {
                    req.flash('error', 'Suburb Already Exists!');
                    res.redirect(namedRouter.urlFor('suburb.edit', {
                        id: suburbId
                    }));
                } else {
                    let suburbUpdate = await suburbRepo.updateById(req.body, suburbId);
                    if (!_.isEmpty(suburbUpdate) && suburbUpdate._id) {
                        req.flash('success', "Suburb Updated Successfully");
                        res.redirect(namedRouter.urlFor('suburb.list'));
                    } else {
                        req.flash('error', "Suburb Failed To Update!");
                        res.redirect(namedRouter.urlFor('suburb.list'));
                    }
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
            let data = await suburbRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await suburbRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("suburb.list"));
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
            let suburbDeleteData = await suburbRepo.getById(req.params.id);
            if (!_.isEmpty(suburbDeleteData)) {
                let suburbDelete = await suburbRepo.updateById({ "isDeleted": true }, suburbDeleteData._id)
                if (!_.isEmpty(suburbDelete) && suburbDelete._id) {
                    req.flash('success', 'suburb Deleted Successfully');
                    res.redirect(namedRouter.urlFor('suburb.list'));
                } else {
                    req.flash('error', "Sorry suburb Not Deleted");
                    res.redirect(namedRouter.urlFor('suburb.list'));
                }
            } else {
                req.flash('error', "Sorry suburb not found");
                res.redirect(namedRouter.urlFor('suburb.list'));
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new suburbController();