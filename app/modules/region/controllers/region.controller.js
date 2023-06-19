const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const regionRepo = require('region/repositories/region.repository');
const mongoose = require('mongoose');
class regionController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The region Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await regionRepo.getStats(req);
            res.render('region/views/list', {
                page_name: 'region',
                page_title: 'Region List',
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
     * @Description Get All Skill
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
            let regionData = await regionRepo.getAll(req);
            let data = {
                "recordsTotal": regionData.total,
                "recordsFiltered": regionData.total,
                "data": regionData.docs
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
            res.render('region/views/add', {
                page_name: 'region',
                page_title: 'Region Add',
                user: req.user,
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method insert
     * @Description To Insert Region Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            req.body.regionName = req.body.regionName.trim();
            if (_.isEmpty(req.body.regionName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('region.create'));
            } else {
                let isRegionExists = await regionRepo.getByField({ 'regionName': { $regex: "^" + req.body.regionName.trim() + "$", $options: "i" }, isDeleted: false });
                if (!_.isEmpty(isRegionExists)) {
                    req.flash('error', 'Region Already Exists!');
                    res.redirect(namedRouter.urlFor('region.create'));
                } else {
                    let saveData = await regionRepo.save(req.body);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'Region Added Successfully!');
                        res.redirect(namedRouter.urlFor('region.list'));
                    } else {
                        req.flash('error', 'Region Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('region.create'));
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
            let regionData = await regionRepo.getById(req.params.id);
            if (!_.isEmpty(regionData)) {
                res.render('region/views/edit', {
                    page_name: 'region',
                    page_title: 'Region Edit',
                    user: req.user,
                    response: regionData,
                })
            } else {
                req.flash('error', 'Region Not Found!');
                res.redirect(namedRouter.urlFor('region.list'));
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
            req.body.regionName = req.body.regionName.trim();
            if (_.isEmpty(req.body.regionName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('region.list'));
            } else {
                const regionId = req.body.id;
                let isRegionExists = await regionRepo.getByField({ 'regionName': { $regex: "^" + req.body.regionName.trim() + "$", $options: "i" }, _id: { $ne: regionId }, isDeleted: false });
                if (!_.isEmpty(isRegionExists)) {
                    req.flash('error', 'Region Already Exists!');
                    res.redirect(namedRouter.urlFor('region.edit', {
                        id: regionId
                    }));
                } else {
                    let regionUpdate = await regionRepo.updateById(req.body, regionId);
                    if (!_.isEmpty(regionUpdate) && regionUpdate._id) {
                        req.flash('success', "Region Updated Successfully");
                        res.redirect(namedRouter.urlFor('region.list'));
                    } else {
                        req.flash('error', "Region Failed To Update!");
                        res.redirect(namedRouter.urlFor('region.list'));
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
            let data = await regionRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await regionRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("region.list"));
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
            let regionDeleteData = await regionRepo.getById(req.params.id);
            if (!_.isEmpty(regionDeleteData)) {
                let regionDelete = await regionRepo.updateById({ "isDeleted": true }, regionDeleteData._id)
                if (!_.isEmpty(regionDelete) && regionDelete._id) {
                    req.flash('success', 'region Deleted Successfully');
                    res.redirect(namedRouter.urlFor('region.list'));
                } else {
                    req.flash('error', "Sorry region Not Deleted");
                    res.redirect(namedRouter.urlFor('region.list'));
                }
            } else {
                req.flash('error', "Sorry region not found");
                res.redirect(namedRouter.urlFor('region.list'));
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new regionController();