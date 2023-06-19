const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const fs = require('fs');
const categoryManagementRepo = require('categoryManagement/repositories/categoryManagement.repository');
const mongoose = require('mongoose');
class categoryManagementController {
    constructor() { }

    /**
     * @Method list
     * @Description To Show The Category Management Listing Page
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let data = await categoryManagementRepo.getStats(req);
            res.render('categoryManagement/views/list', {
                page_name: 'category-management',
                page_title: 'Category List',
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
     * @Description Get All Category
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
            let category = await categoryManagementRepo.getAll(req);

            let data = {
                "recordsTotal": category.total,
                "recordsFiltered": category.total,
                "data": category.docs
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
     * @Description To Show The Add Category Form
    */
    async create(req, res) {
        try {
            let allCategories = await categoryManagementRepo.getAllByField({
                isDeleted: false,
                status: 'Active',
                parentCategory: null
            });
            res.render('categoryManagement/views/add', {
                page_name: 'category-management',
                page_title: 'Category Add',
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
     * @Description To Insert Category Management Data To Collection
    */
    async insert(req, res) {
        try {

            if (!_.has(req.body, 'categoryName') || ((_.has(req.body, 'categoryName') && (_.isUndefined(req.body.categoryName)) || _.isNull(req.body.categoryName) || _.isEmpty(req.body.categoryName.trim())))) {
                req.flash('error', 'Category Name is required.');
                return res.redirect(namedRouter.urlFor('category-management.create'));
            }

            req.body.slug = (req.body.categoryName).toLowerCase().replace(/\s/g, '');
            // console.log(req.body.slug, "sssssssssslug");

            let findCategory = await categoryManagementRepo.getByField({ slug: req.body.slug });
            if (!_.isEmpty(findCategory)) {
                req.flash('error', 'Slug name already exists. Please try another category name.');
                return res.redirect(namedRouter.urlFor('category-management.create'));
            }

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'icon') {
                            req.body.icon = req.files[i].filename;
                        }
                    }

                }
            }

            if (_.has(req, 'files')) {

                if (req.files.length > 0) {

                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'banner') {
                            req.body.banner = req.files[i].filename;
                        }
                    }

                }
            }


            req.body.categoryName = req.body.categoryName.trim();

            if (_.has(req.body, 'subCategory3')) {
                req.body.parentCategory = req.body.subCategory3;
            } else if (_.has(req.body, 'subCategory')) {
                req.body.parentCategory = req.body.subCategory;
            }

            if (_.has(req.body, 'parentCategory')) {
                let categoryData = await categoryManagementRepo.getById(req.body.parentCategory);
                // console.log(categoryData);
                req.body.level = categoryData.parentCategory == null ? 1 : (categoryData.level == 2 ? 3 : 2);
                
                console.log(req.body.level);
            } else {
                req.body.level = 0;
            }


            // console.log(req.body);
            let saveData = await categoryManagementRepo.save(req.body);
            if (!_.isEmpty(saveData) && saveData._id) {
                req.flash('success', 'Category Added Successfully!');
                res.redirect(namedRouter.urlFor('category-management.list'));
            } else {
                req.flash('error', 'Category Not Added Successfully!');
                res.redirect(namedRouter.urlFor('category-management.create'));
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
                _id: {
                    $ne: mongoose.Types.ObjectId(req.params.id)
                },
                parentCategory: null
            });

            let categoryManagementData = await categoryManagementRepo.getById(req.params.id);




            //if (_.isEmpty(userExists)) {}


            if (!_.isEmpty(categoryManagementData)) {

                let category_1 = null;

                if (_.isObject(categoryManagementData.parentCategory)) {
                    category_1 = categoryManagementData.parentCategory;
                }

                let subcategoryData = await categoryManagementRepo.getById(categoryManagementData.parentCategory);

                //console.log(subcategoryData);

                if (!_.isEmpty(subcategoryData) && _.isObject(subcategoryData.parentCategory)) {
                    category_1 = subcategoryData.parentCategory;
                }

                let allSubCategories = {};
                if (!_.isEmpty(subcategoryData) && _.isObject(subcategoryData.parentCategory)) {
                    allSubCategories = await categoryManagementRepo.getAllByField({
                        isDeleted: false,
                        status: 'Active',
                        _id: {
                            $ne: mongoose.Types.ObjectId(req.params.id)
                        },
                        parentCategory: subcategoryData.parentCategory
                    });
                    //console.log(allSubCategories);
                }
                //console.log(allSubCategories);


                res.render('categoryManagement/views/edit', {
                    page_name: 'category-management',
                    page_title: 'Category Edit',
                    user: req.user,
                    response: categoryManagementData,
                    allCategories,
                    category_1,
                    allSubCategories
                })
            } else {
                req.flash('error', 'Category Not Found!');
                res.redirect(namedRouter.urlFor('category-management.list'));
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
            req.body.categoryName = req.body.categoryName.trim();

            req.body.level = _.has(req.body, 'parentCategory2') ? 2 : (_.has(req.body, 'parentCategory') ? 1 : 0);

            req.body.parentCategory = _.has(req.body, 'parentCategory2') ? req.body.parentCategory2 : (_.has(req.body, 'parentCategory') ? req.body.parentCategory : null);

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'icon') {
                            req.body.icon = req.files[i].filename;
                        }
                    }

                }
            }

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'banner') {
                            req.body.banner = req.files[i].filename;
                        }
                    }

                }
            }

            if (_.isEmpty(req.body.categoryName)) {
                req.flash('error', 'Field Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('category-management.edit', { id: req.body.id }));

            } else {
                const categoryManagementId = req.body.id;
                let isCategoryExists = await categoryManagementRepo.getByField({ 'categoryName': { $regex: "^" + req.body.categoryName.trim() + "$", $options: "i" }, _id: { $ne: categoryManagementId }, isDeleted: false, categoryType: { $eq: 'Service' } });
                if (!_.isEmpty(isCategoryExists)) {
                    req.flash('error', 'Category Name Already Exists!');
                    res.redirect(namedRouter.urlFor('category-management.edit', { id: categoryManagementId }));
                } else {
                    // console.log(req.body);
                    let categoryManagementDataUpdate = await categoryManagementRepo.updateById(req.body, categoryManagementId)
                    if (!_.isEmpty(categoryManagementDataUpdate) && categoryManagementDataUpdate._id) {
                        req.flash('success', "Category Updated Successfully");
                        res.redirect(namedRouter.urlFor('category-management.list'));
                    } else {
                        req.flash('error', "Category Failed To Update!");
                        res.redirect(namedRouter.urlFor('category-management.list'));
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
            let data = await categoryManagementRepo.getById(req.params.id);
            if (!_.isEmpty(data)) {
                let dataStatus = data.status == "Active" ? "Inactive" : "Active";
                await categoryManagementRepo.updateById({ status: dataStatus }, req.params.id);

                req.flash("success", "Status Has Been Changed Successfully");
                res.redirect(namedRouter.urlFor("category-management.list"));
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
            let categoryManagementDeleteData = await categoryManagementRepo.getById(req.params.id);
            if (!_.isEmpty(categoryManagementDeleteData)) {
                let categoryManagementDelete = await categoryManagementRepo.updateById({ "isDeleted": true }, categoryManagementDeleteData._id)
                if (!_.isEmpty(categoryManagementDelete) && categoryManagementDelete._id) {
                    req.flash('success', 'Category Deleted Successfully');
                    res.redirect(namedRouter.urlFor('category-management.list'));
                } else {
                    req.flash('error', "Sorry Category Not Deleted");
                    res.redirect(namedRouter.urlFor('category-management.list'));
                }
            } else {
                req.flash('error', "Sorry Category not found");
                res.redirect(namedRouter.urlFor('category-management.list'));
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Why We implement this functionality for 3 level of categories
     * @Method getSubCategory
     * @Description To Get The Sub Category 
    */
    async getSubCategory(req, res) {
        try {

            if (!_.isNull(req.params.id) && req.params.id != '') {
                let allSubCatData = await categoryManagementRepo.getAllByField({
                    parentCategory: req.params.id
                });
                if (!_.isEmpty(allSubCatData)) {
                    return res.json({
                        data: allSubCatData
                    })
                } else {
                    return res.json({
                        data: []
                    })
                }
            }
            else {
                return res.json({
                    data: []
                })
            }
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }
}

module.exports = new categoryManagementController();