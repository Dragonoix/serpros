const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const faqManagementRepo = require('faqManagement/repositories/faqManagement.repository');
const mongoose = require('mongoose');
class FaqManagementController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The FAQ Management Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await faqManagementRepo.getStats(req);
            res.render('faqManagement/views/list', {
                page_name: 'faq-management',
                page_title: 'FAQ List',
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
     * @Description Get All FAQ
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
            let faq = await faqManagementRepo.getAll(req);
            let data = {
                "recordsTotal": faq.total,
                "recordsFiltered": faq.total,
                "data": faq.docs
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
            let allCategories = await faqManagementRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                parentCategory: null

            });
            res.render('faqManagement/views/add', {
                page_name: 'faq-management',
                page_title: 'FAQ Add',
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
     * @Description To Insert FAQ Management Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            req.body.question = req.body.question.trim();
            req.body.answer = req.body.answer.trim();
            if (_.isEmpty(req.body.question) || _.isEmpty(req.body.answer)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('faq-management.create'));
            } else {
                let isQuestionExists = await faqManagementRepo.getByField({ 'question': { $regex: "^" + req.body.question.trim() + "$", $options: "i" }, isDeleted: false });
                if (!_.isEmpty(isQuestionExists)) {
                    req.flash('error', 'FAQ Question Already Exists!');
                    res.redirect(namedRouter.urlFor('faq-management.create'));
                } else {
                    let saveData = await faqManagementRepo.save(req.body);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'FAQ Added Successfully!');
                        res.redirect(namedRouter.urlFor('faq-management.list'));
                    } else {
                        req.flash('error', 'FAQ Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('faq-management.create'));
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
            let faqManagementData = await faqManagementRepo.getById(req.params.id);
            // console.log(faqManagementData);
            if (!_.isEmpty(faqManagementData)) {
                res.render('faqManagement/views/edit', {
                    page_name: 'faq-management',
                    page_title: 'FAQ Edit',
                    user: req.user,
                    response: faqManagementData,
                })
            } else {
                req.flash('error', 'FAQ Not Found!');
                res.redirect(namedRouter.urlFor('faq-management.list'));
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
            req.body.question = req.body.question.trim();
            req.body.answer = req.body.answer.trim();
            if (_.isEmpty(req.body.question) || _.isEmpty(req.body.answer)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('faq-management.create'));
            } else {
                const faqManagementId = req.body.id;
                let isQuestionExists = await faqManagementRepo.getByField({ 'question': { $regex: "^" + req.body.question.trim() + "$", $options: "i" },  _id: { $ne: faqManagementId }, isDeleted: false });
                if (!_.isEmpty(isQuestionExists)) {
                    req.flash('error', 'Question Already Exists!');
                    res.redirect(namedRouter.urlFor('faq-management.edit', { id: faqManagementId }));
                } else {
                    let faqManagementDataUpdate = await faqManagementRepo.updateById(req.body, faqManagementId)
                    if (!_.isEmpty(faqManagementDataUpdate) && faqManagementDataUpdate._id) {
                        req.flash('success', "FAQ Updated Successfully");
                        res.redirect(namedRouter.urlFor('faq-management.list'));
                    } else {
                        req.flash('error', "FAQ Failed To Update!");
                        res.redirect(namedRouter.urlFor('faq-management.list'));
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
            let data = await faqManagementRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await faqManagementRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("faq-management.list"));
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
            let categoryManagementDeleteData = await faqManagementRepo.getById(req.params.id);
            if (!_.isEmpty(categoryManagementDeleteData)) {
                let categoryManagementDelete = await faqManagementRepo.updateById({ "isDeleted": true }, categoryManagementDeleteData._id)
                if (!_.isEmpty(categoryManagementDelete) && categoryManagementDelete._id) {
                    req.flash('success', 'FAQ Deleted Successfully');
                    res.redirect(namedRouter.urlFor('faq-management.list'));
                } else {
                    req.flash('error', "Sorry FAQ Not Deleted");
                    res.redirect(namedRouter.urlFor('faq-management.list'));
                }
            } else {
                req.flash('error', "Sorry FAQ not found");
                res.redirect(namedRouter.urlFor('faq-management.list'));
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new FaqManagementController();