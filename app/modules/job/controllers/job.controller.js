const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const jobRepo = require('job/repositories/job.repository');
const mongoose = require('mongoose');
class jobController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The job Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            
            let data = await jobRepo.getStats(req);
            // console.log(data);
            res.render('job/views/list', {
                page_name: 'job',
                page_title: 'Job',
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
            let jobData = await jobRepo.getAll(req);
            let data = {
                "recordsTotal": jobData.total,
                "recordsFiltered": jobData.total,
                "data": jobData.docs
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    /**
     * @Method edit
     * @Description To Show The Edit Form
    */
    async edit(req, res) {
        try {
            let jobData = await jobRepo.getById(req.params.id);
            if (!_.isEmpty(jobData)) {
                res.render('job/views/edit', {
                    page_name: 'job',
                    page_title: 'Edit Job',
                    user: req.user,
                    response: jobData,
                })
            } else {
                req.flash('error', 'job Not Found!');
                res.redirect(namedRouter.urlFor('job.list'));
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
            req.body.title = req.body.title.trim();
            req.body.budgetAmount = req.body.budgetAmount.trim();
            if (_.isEmpty(req.body.title) || _.isEmpty(req.body.budgetAmount)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('job.list'));
            } else {
                const jobId = req.body.id;
                let jobUpdate = await jobRepo.updateById(req.body, jobId)
                if (!_.isEmpty(jobUpdate) && jobUpdate._id) {
                    req.flash('success', "job Updated Successfully");
                    res.redirect(namedRouter.urlFor('job.list'));
                } else {
                    req.flash('error', "job Failed To Update!");
                    res.redirect(namedRouter.urlFor('job.list'));
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
            let data = await jobRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await jobRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("job.list"));
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
            let jobDeleteData = await jobRepo.getById(req.params.id);
            if (!_.isEmpty(jobDeleteData)) {
                let jobDelete = await jobRepo.updateById({ "isDeleted": true }, jobDeleteData._id)
                if (!_.isEmpty(jobDelete) && jobDelete._id) {
                    req.flash('success', 'job Deleted Successfully');
                    res.redirect(namedRouter.urlFor('job.list'));
                } else {
                    req.flash('error', "Sorry job Not Deleted");
                    res.redirect(namedRouter.urlFor('job.list'));
                }
            } else {
                req.flash('error', "Sorry job not found");
                res.redirect(namedRouter.urlFor('job.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    async detail (req, res) {
        try {
            let jobAvail = await jobRepo.getByIdCustom(req.params.id);

            res.render('job/views/details.ejs', {
                page_name: 'job',
                page_title: 'Job Details',
                user: req.user,
                response: jobAvail
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }
    };

}

module.exports = new jobController();