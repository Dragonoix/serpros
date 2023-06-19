const mongoose = require('mongoose');
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const categoryRepo = require("categoryManagement/repositories/categoryManagement.repository");
const userRepo = require('user/repositories/user.repository');
const priceFilterMasterRepo = require('priceFilterMaster/repositories/priceFilterMaster.repository');
const invitationRepo = require("invitation/repositories/invitation.repository");
const testimonialRepo = require("testimonial/repositories/testimonial.repository");
const jobRepo = require("job/repositories/job.repository");



class CategoryController {
    constructor() { }

    async getAllCategory(req, res) {
        try {

            let categoryData = await categoryRepo.getSubcategory({ "isDeleted": false, "status": "Active", "parentCategory": null });

            if (!_.isEmpty(categoryData)) {
                requestHandler.sendSuccess(res, 'All categories fetched successfully.')(categoryData);

            } else {
                requestHandler.throwError(400, 'Bad Request', 'Categories Not Found')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async getSubCategoryById(req, res) {
        try {


            let category = await categoryRepo.getAllByField({
                "parentCategory": mongoose.Types.ObjectId(req.params.id)
            });

            requestHandler.sendSuccess(res, 'All sub categories fetched successfully.')(category);


        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async getSubCategoryByCategory(req, res) {
        try {
            if (req.params.slug == 'all') {

                let subCategoryData = await categoryRepo.getSubcategory({
                    "isDeleted": false, "status": "Active", "parentCategory": null
                });

                if (!_.isEmpty(subCategoryData)) {
                    return requestHandler.sendSuccess(res, 'All sub categories fetched successfully.')({ category: subCategoryData, tree: [{ slug: "all", name: "Categories", has_subCategory: true }], header: { title: "Categories", description: "" } });
                } else {
                    return requestHandler.sendSuccess(res, 'All sub categories fetched successfully.')([]);
                }
            } else {

                let category = await categoryRepo.getByField({
                    "slug": req.params.slug
                });

                if (_.isEmpty(category)) {
                    return requestHandler.throwError(400, 'Bad Request', 'Invalid slug')();
                }
                let subCategoryData2 = await categoryRepo.getSubcategory({
                    "isDeleted": false, "status": "Active",
                    "parentCategory": category._id
                });

                if (!_.isEmpty(subCategoryData2)) {
                    requestHandler.sendSuccess(res, 'All sub categories fetched successfully.')({ category: subCategoryData2, tree: subCategoryData2[0].tree, header: { title: category.categoryName, description: category.description } });
                } else {
                    requestHandler.sendSuccess(res, 'All sub categories fetched successfully.')([]);
                }
            }


        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async categoryBreakdown(req, res) {
        try {

            let categoryData = await categoryRepo.getBreakdown();

            if (!_.isEmpty(categoryData)) {
                requestHandler.sendSuccess(res, 'All categories fetched successfully.')(categoryData);

            } else {
                requestHandler.throwError(400, 'Bad Request', 'Categories Not Found')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async getServiceProviderByCategory(req, res) {
        try {
            let payload = {};

            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                let price = await priceFilterMasterRepo.getById(mongoose.Types.ObjectId(req.body.price));
                req.body.price = {
                    "tl": price.less_than,
                    "gt": price.greater_than
                }
                // console.log(price);
            }

            let servicer = await userRepo.getAllServicerByCategory(req);
            let parentCategory = await categoryRepo.getParentCategories();

            if (!_.isEmpty(servicer)) {
                if (!_.isEmpty(parentCategory)) {
                    payload = { servicer, parentCategory };
                } else {
                    payload = { servicer, parentCategory };
                }
                requestHandler.sendSuccess(res, 'All servicer and category fetched successfully.')(payload);

            } else {
                if (!_.isEmpty(parentCategory)) {
                    payload = { servicer, parentCategory };
                } else {
                    payload = { servicer, parentCategory };
                }
                requestHandler.sendSuccess(res, 'All servicer and category fetched successfully.')(payload);
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async getServicer(req, res) {
        try {

            // console.log('Hello');
            let payload = {};

            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                let price = await priceFilterMasterRepo.getById(mongoose.Types.ObjectId(req.body.price));
                req.body.price = {
                    "tl": price.less_than,
                    "gt": price.greater_than
                }
                // console.log(price);
            }

            let servicer = await userRepo.getAllServicer(req);
            let parentCategory = await categoryRepo.getParentCategories();

            if (!_.isEmpty(servicer)) {
                if (!_.isEmpty(parentCategory)) {
                    payload = { servicer, parentCategory };
                } else {
                    payload = { servicer, parentCategory };
                }
                requestHandler.sendSuccess(res, 'All servicer and category fetched successfully.')(payload);

            } else {
                if (!_.isEmpty(parentCategory)) {
                    payload = { servicer, parentCategory };
                } else {
                    payload = { servicer, parentCategory };
                }
                requestHandler.sendSuccess(res, 'All servicer and category fetched successfully.')(payload);
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


    async getJobsByCategory(req, res) {
        try {
            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                let price = await priceFilterMasterRepo.getById(mongoose.Types.ObjectId(req.body.price));
                req.body.price = {
                    "tl": price.less_than,
                    "gt": price.greater_than
                }
                // console.log(price);
            }

            let category = await categoryRepo.getByField({
                "slug": req.params.slug
            });
            if (_.isEmpty(category)) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid slug')();
            }

            req.body.catId = category._id
            let data = await jobRepo.getAllJobByCategory(req);

            let tree = [];
            let treeData = await categoryRepo.getReverseTree(req.body.catId);
            // console.log(treeData);
            if (_.has(treeData.childCategory, 'sub_childCategory') && _.has(treeData.childCategory.sub_childCategory, 'sub_sub_childCategory') && !_.isEmpty(treeData.childCategory.sub_childCategory.sub_sub_childCategory)) {
                tree = [
                    {
                        name: "Categories",
                        slug: "all",
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.sub_childCategory.sub_sub_childCategory.categoryName,
                        slug: treeData.childCategory.sub_childCategory.sub_sub_childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.sub_childCategory.categoryName,
                        slug: treeData.childCategory.sub_childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.categoryName,
                        slug: treeData.childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.categoryName,
                        slug: treeData.slug,
                        has_subCategory: false
                    }
                ]
            }
            else if (_.has(treeData.childCategory, 'sub_childCategory') && !_.isEmpty(treeData.childCategory.sub_childCategory)) {
                tree = [
                    {
                        name: "Categories",
                        slug: "all",
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.sub_childCategory.categoryName,
                        slug: treeData.childCategory.sub_childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.categoryName,
                        slug: treeData.childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.categoryName,
                        slug: treeData.slug,
                        has_subCategory: false
                    }
                ]
            } else if (_.has(treeData, 'childCategory') && !_.isEmpty(treeData.childCategory)) {
                tree = [
                    {
                        name: "Categories",
                        slug: "all",
                        has_subCategory: true
                    },
                    {
                        name: treeData.childCategory.categoryName,
                        slug: treeData.childCategory.slug,
                        has_subCategory: true
                    },
                    {
                        name: treeData.categoryName,
                        slug: treeData.slug,
                        has_subCategory: false
                    }
                ]
            } else {
                tree = [
                    {
                        name: "Categories",
                        slug: "all",
                        has_subCategory: true
                    },
                    {
                        name: treeData.categoryName,
                        slug: treeData.slug,
                        has_subCategory: false
                    }
                ]
            }


            requestHandler.sendSuccess(res, 'Jobs fetched successfully.')({ jobs: data, tree: tree, header: { title: category.categoryName, description: category.description } });
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }

};


module.exports = new CategoryController();