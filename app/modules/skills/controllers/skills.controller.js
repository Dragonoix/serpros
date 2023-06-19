const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const skillRepo = require('skills/repositories/skills.repository');
const categoryManagementRepo = require('categoryManagement/repositories/categoryManagement.repository');
const mongoose = require('mongoose');
class skillController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The Skill Management Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await skillRepo.getStats(req);
            res.render('skills/views/list', {
                page_name: 'skill-management',
                page_title: 'Skill List',
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
            let skill = await skillRepo.getAll(req);
            let data = {
                "recordsTotal": skill.total,
                "recordsFiltered": skill.total,
                "data": skill.docs
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
     * @Description To Show The Add Skill Form
    */
    async create(req, res) {
        try {
            let allCategories = await categoryManagementRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                parentSkill: null
            });
            res.render('skills/views/add', {
                page_name: 'skill-management',
                page_title: 'Skill Add',
                allCategories,
                user: req.user,
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * @Method insert
     * @Description To Insert Skill Management Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            if (_.isEmpty(req.body.skill)) {
                req.flash('error', 'Skill Name Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('skill.create'));
                return;
            }

            if (_.isEmpty(req.body.category)) {
                req.flash('error', 'Category Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('skill.create'));
                return;
            }

            let saveData = await skillRepo.save(req.body);
            if (!_.isEmpty(saveData) && saveData._id) {
                req.flash('success', 'Skill Added Successfully!');
                res.redirect(namedRouter.urlFor('skill.list'));
            } else {
                req.flash('error', 'Skill Not Added Successfully!');
                res.redirect(namedRouter.urlFor('skill.create'));
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
            let allCategories = await categoryManagementRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                parentSkill: null
            });
            let skillData = await skillRepo.getById(req.params.id);
            if (!_.isEmpty(skillData)) {
                res.render('skills/views/edit', {
                    page_name: 'skill-management',
                    page_title: 'Skill Edit',
                    user: req.user,
                    response: skillData,
                    allCategories
                })
            } else {
                req.flash('error', 'Skill Not Found!');
                res.redirect(namedRouter.urlFor('skill.list'));
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
            
            if (_.isEmpty(req.body.skill)) {
                req.flash('error', 'Skill Name Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('skill.create'));
                return;
            }

            if (_.isEmpty(req.body.category)) {
                req.flash('error', 'Category Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('skill.create'));
                return;
            }
            
            let skillDataUpdate = await skillRepo.updateById(req.body, req.body.id)
            if (!_.isEmpty(skillDataUpdate) && skillDataUpdate._id) {
                req.flash('success', "Skill Updated Successfully");
                res.redirect(namedRouter.urlFor('skill.list'));
            } else {
                req.flash('error', "Skill Failed To Update!");
                res.redirect(namedRouter.urlFor('skill.list'));
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
            let data = await skillRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await skillRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("skill.list"));
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
            let skillDeleteData = await skillRepo.getById(req.params.id);
            if (!_.isEmpty(skillDeleteData)) {
                let skillDelete = await skillRepo.updateById({ "isDeleted": true }, skillDeleteData._id)
                if (!_.isEmpty(skillDelete) && skillDelete._id) {
                    req.flash('success', 'Skill Deleted Successfully');
                    res.redirect(namedRouter.urlFor('skill.list'));
                } else {
                    req.flash('error', "Sorry Skill Not Deleted");
                    res.redirect(namedRouter.urlFor('skill.list'));
                }
            } else {
                req.flash('error', "Sorry Skill not found");
                res.redirect(namedRouter.urlFor('skill.list'));
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new skillController();