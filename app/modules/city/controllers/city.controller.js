const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const cityRepo = require('city/repositories/city.repository');
const regionRepo = require('region/repositories/region.repository');
const mongoose = require('mongoose');
class cityController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The city Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await cityRepo.getStats(req);
            res.render('city/views/list', {
                page_name: 'city',
                page_title: 'City List',
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
            let cityData = await cityRepo.getAll(req);
            let data = {
                "recordsTotal": cityData.total,
                "recordsFiltered": cityData.total,
                "data": cityData.docs
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
            res.render('city/views/add', {
                page_name: 'city',
                page_title: 'City Add',
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
     * @Description To Insert City Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            req.body.cityName = req.body.cityName.trim();
            if (_.isEmpty(req.body.cityName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('city.create'));
            } else {
                let isCityExists = await cityRepo.getByField({ 'cityName': { $regex: "^" + req.body.cityName.trim() + "$", $options: "i" }, isDeleted: false });
                if (!_.isEmpty(isCityExists)) {
                    req.flash('error', 'City Already Exists!');
                    res.redirect(namedRouter.urlFor('city.create'));
                } else {
                    let saveData = await cityRepo.save(req.body);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'City Added Successfully!');
                        res.redirect(namedRouter.urlFor('city.list'));
                    } else {
                        req.flash('error', 'City Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('city.create'));
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
            let cityData = await cityRepo.getById(req.params.id);
            if (!_.isEmpty(cityData)) {
                res.render('city/views/edit', {
                    page_name: 'city',
                    page_title: 'City Edit',
                    user: req.user,
                    response: cityData,
                    allRegions
                })
            } else {
                req.flash('error', 'City Not Found!');
                res.redirect(namedRouter.urlFor('city.list'));
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
            req.body.cityName = req.body.cityName.trim();
            if (_.isEmpty(req.body.cityName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('city.list'));
            } else {
                const cityId = req.body.id;
                let isCityExists = await cityRepo.getByField({ 'cityName': { $regex: "^" + req.body.cityName.trim() + "$", $options: "i" }, _id: { $ne: cityId }, isDeleted: false });
                if (!_.isEmpty(isCityExists)) {
                    req.flash('error', 'City Already Exists!');
                    res.redirect(namedRouter.urlFor('city.edit', {
                        id: cityId
                    }));
                } else {
                    let cityUpdate = await cityRepo.updateById(req.body, cityId);
                    if (!_.isEmpty(cityUpdate) && cityUpdate._id) {
                        req.flash('success', "City Updated Successfully");
                        res.redirect(namedRouter.urlFor('city.list'));
                    } else {
                        req.flash('error', "City Failed To Update!");
                        res.redirect(namedRouter.urlFor('city.list'));
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
            let data = await cityRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await cityRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("city.list"));
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
            let cityDeleteData = await cityRepo.getById(req.params.id);
            if (!_.isEmpty(cityDeleteData)) {
                let cityDelete = await cityRepo.updateById({ "isDeleted": true }, cityDeleteData._id)
                if (!_.isEmpty(cityDelete) && cityDelete._id) {
                    req.flash('success', 'city Deleted Successfully');
                    res.redirect(namedRouter.urlFor('city.list'));
                } else {
                    req.flash('error', "Sorry city Not Deleted");
                    res.redirect(namedRouter.urlFor('city.list'));
                }
            } else {
                req.flash('error', "Sorry city not found");
                res.redirect(namedRouter.urlFor('city.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Method getAllCities
     * @Description Get All Cities
    */
    async getAllCities(req, res) {
        try {
            let allCityData = await cityRepo.getAllByField({
                region: req.params.id
            });
            if (!_.isEmpty(allCityData)) {
                return res.json({
                    data: allCityData
                })
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new cityController();