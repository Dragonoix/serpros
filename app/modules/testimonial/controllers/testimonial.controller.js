const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const TestimonialRepo = require('testimonial/repositories/testimonial.repository');
const mongoose = require('mongoose');
class TestimonialController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The Testimonial Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await TestimonialRepo.getStats(req);
            res.render('testimonial/views/list', {
                page_name: 'testimonial-management',
                page_title: 'Testimonial List',
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
     * @Description Get All Testimonials
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
            let testimonial = await TestimonialRepo.getAll(req);
            let data = {
                "recordsTotal": testimonial.total,
                "recordsFiltered": testimonial.total,
                "data": testimonial.docs
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
     * @Description To Show The Add Testimonial Form
    */
    async create(req, res) {
        try {
            let allCategories = await TestimonialRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                parentCategory: null

            });
            res.render('testimonial/views/add', {
                page_name: 'testimonial-management',
                page_title: 'Testimonial Add',
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
     * @Description To Insert Testimonial Data To Collection
    */
    async insert(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }
            req.body.name = req.body.name.trim();
            req.body.message = req.body.message.trim();
            if (_.isEmpty(req.body.name) || _.isEmpty(req.body.message)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('testimonial.create'));
            } else {
                    if (req.files.length > 0) {
                        req.body.image = req.files[0].filename;
                    }

                    let saveData = await TestimonialRepo.save(req.body);
                    if (!_.isEmpty(saveData) && saveData._id) {
                        req.flash('success', 'Testimonial Added Successfully!');
                        res.redirect(namedRouter.urlFor('testimonial.list'));
                    } else {
                        req.flash('error', 'Testimonial Not Added Successfully!');
                        res.redirect(namedRouter.urlFor('testimonial.create'));
                    }
                // }
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
            let testimonialData = await TestimonialRepo.getById(req.params.id);
            // console.log(testimonialData);
            if (!_.isEmpty(testimonialData)) {
                res.render('testimonial/views/edit', {
                    page_name: 'testimonial-management',
                    page_title: 'Testimonial Edit',
                    user: req.user,
                    response: testimonialData,
                })
            } else {
                req.flash('error', 'Testimonial Not Found!');
                res.redirect(namedRouter.urlFor('testimonial.list'));
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
            req.body.name = req.body.name.trim();
            req.body.message = req.body.message.trim();
            if (_.isEmpty(req.body.name) || _.isEmpty(req.body.message)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('testimonial.create'));
            } else {
                const testimonialId = req.body.id;
                let testimonialData = await TestimonialRepo.getById(testimonialId);
                    if (req.files.length > 0) {
                        req.body.image = req.files[0].filename;
                        if (!_.isEmpty(testimonialData) && !_.isEmpty(testimonialData.image) && fs.existsSync("./public/uploads/testimonial/" + testimonialData.image)) {
                            fs.unlinkSync("./public/uploads/testimonial/" + testimonialData.image);
                        }
                    }
                    let testimonialDataUpdate = await TestimonialRepo.updateById(req.body, testimonialId)
                    if (!_.isEmpty(testimonialDataUpdate) && testimonialDataUpdate._id) {
                        req.flash('success', "Testimonial Updated Successfully");
                        res.redirect(namedRouter.urlFor('testimonial.list'));
                    } else {
                        req.flash('error', "Testimonial Failed To Update!");
                        res.redirect(namedRouter.urlFor('testimonial.list'));
                    }
            }
        } catch (err) {
            console.log("testimonial update",err.message);
            req.flash('error', "Testimonial Failed To Update!");
            res.redirect(namedRouter.urlFor('testimonial.list'));
        }
    }

    /**
     * @Method statusChange
     * @Description To Change The Status
    */
    async statusChange(req, res) {
        try {
            let data = await TestimonialRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await TestimonialRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("testimonial.list"));
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
            let testimonialDeleteData = await TestimonialRepo.getById(req.params.id);
            if (!_.isEmpty(testimonialDeleteData)) {
                let testimonialDelete = await TestimonialRepo.updateById({ "isDeleted": true }, testimonialDeleteData._id)
                if (!_.isEmpty(testimonialDelete) && testimonialDelete._id) {
                    req.flash('success', 'Testimonial Deleted Successfully');
                    res.redirect(namedRouter.urlFor('testimonial.list'));
                } else {
                    req.flash('error', "Sorry Testimonial Not Deleted");
                    res.redirect(namedRouter.urlFor('testimonial.list'));
                }
            } else {
                req.flash('error', "Sorry Testimonial not found");
                res.redirect(namedRouter.urlFor('testimonial.list'));
            }
        } catch (err) {
            throw err;
        }
    };
}

module.exports = new TestimonialController();