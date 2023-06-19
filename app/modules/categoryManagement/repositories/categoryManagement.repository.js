const mongoose = require('mongoose');
const CategoryManagement = require('categoryManagement/models/categoryManagement.model');
const User = require('user/models/user.model');
const perPage = config.other.pageLimit;

const CategoryManagementRepo = {

    getAll: async (req) => {

        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
                "categoryType": 'Service'
            });
            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'categoryName': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'parentCategory.categoryName': { $regex: req.body.search.value.trim(), $options: 'i' } }
                    ]
                });
            }


            if (req.body.columns && req.body.columns.length) {
                let statusFilter = _.findWhere(req.body.columns, { data: 'categoryName' });
                if (statusFilter && statusFilter.search && statusFilter.search.value && statusFilter.search.value != '') {
                    if (statusFilter.search.value == 'parent') {
                        and_clauses.push({
                            "parentCategory": null
                        });
                    }

                    if (statusFilter.search.value == 'child') {
                        and_clauses.push({
                            "parentCategory": {
                                $ne: null
                            },
                            "level": 1
                        });
                    }

                    if (statusFilter.search.value == 'sub_child') {
                        and_clauses.push({
                            "parentCategory": {
                                $ne: null
                            },
                            "level": 2
                        });
                    }

                }
            }

            conditions['$and'] = and_clauses;

            let sortOperator = { "$sort": {} };
            if (_.has(req.body, 'order') && req.body.order.length) {
                for (let order of req.body.order) {
                    let sortField = req.body.columns[+order.column].data;
                    if (order.dir == 'desc') {
                        var sortOrder = -1;
                    } else if (order.dir == 'asc') {
                        var sortOrder = 1;
                    }
                    sortOperator["$sort"][sortField] = sortOrder;
                }
            } else {
                sortOperator["$sort"]['createdAt'] = -1;
            }

            var aggregate = CategoryManagement.aggregate([
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            parentId: '$parentCategory'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$parentId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            },
                                            {
                                                $eq: ['$status', 'Active']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    categoryName: 1
                                }
                            }
                        ],
                        as: 'parentCategory'
                    }
                },
                { $unwind: { path: '$parentCategory', preserveNullAndEmptyArrays: true } },
                {
                    $match: conditions
                },
                sortOperator
            ]);

            var options = {
                page: req.body.page,
                limit: req.body.length
            };


            let allRecord = await CategoryManagement.aggregatePaginate(aggregate, options);

            return allRecord;
        } catch (e) {
            console.log("category list err: ", e.message);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await CategoryManagement.findById(id).lean().exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        try {
            let record = await CategoryManagement.findOne(params).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        try {
            let record = await CategoryManagement.find(params).sort({
                'title': 1
            }).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },


    getSubcategory: async (params) => {
        try {
            let record = await CategoryManagement.aggregate([
                {
                    $match: params
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            parentId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$parentCategory', '$$parentId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    categoryName: 1,
                                    slug: 1
                                }
                            }
                        ],
                        as: 'subCategory'
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            parentId: '$parentCategory'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$parentId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'categorymanagements',
                                    let: {
                                        parentId: '$parentCategory'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        {
                                                            $eq: ['$_id', '$$parentId']
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: 'categorymanagements',
                                                let: {
                                                    parentId: '$parentCategory'
                                                },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $and: [
                                                                    {
                                                                        $eq: ['$_id', '$$parentId']
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        $project: {
                                                            categoryName: 1,
                                                            slug: 1
                                                        }
                                                    }
                                                ],
                                                as: 'parentCategoryData3'
                                            }
                                        },
                                        { $unwind: { path: '$parentCategoryData3', preserveNullAndEmptyArrays: true } },
                                        {
                                            $project: {
                                                categoryName: 1,
                                                slug: 1,
                                                parentCategoryData3: '$parentCategoryData3'
                                            }
                                        }
                                    ],
                                    as: 'parentCategoryData2'
                                }
                            },
                            { $unwind: { path: '$parentCategoryData2', preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    categoryName: 1,
                                    slug: 1,
                                    parentCategoryData2: '$parentCategoryData2',

                                }
                            }
                        ],
                        as: 'parentCategoryData'
                    }
                },
                { $unwind: { path: '$parentCategoryData', preserveNullAndEmptyArrays: true } },

                {
                    $project: {
                        parentCategory: 1,
                        categoryName: 1,
                        icon: 1,
                        banner: 1,
                        description: 1,
                        categoryType: 1,
                        level: 1,
                        slug: 1,
                        // parent: '$parentCategoryData',
                        tree: {
                            $switch: {
                                branches: [
                                    { case: '$parentCategoryData.parentCategoryData2.parentCategoryData3', then: [{ slug: "all", name: "Categories", has_subCategory: true }, { "name": "$parentCategoryData.parentCategoryData2.parentCategoryData3.categoryName", "slug": "$parentCategoryData.parentCategoryData2.parentCategoryData3.slug", has_subCategory: true }, { "name": "$parentCategoryData.parentCategoryData2.categoryName", "slug": "$parentCategoryData.parentCategoryData2.slug", has_subCategory: true }, { "name": "$parentCategoryData.categoryName", "slug": "$parentCategoryData.slug", has_subCategory: false } ] },
                                    { case: '$parentCategoryData.parentCategoryData2', then: [{ slug: "all", name: "Categories", has_subCategory: true }, { "name": "$parentCategoryData.parentCategoryData2.categoryName", "slug": "$parentCategoryData.parentCategoryData2.slug", has_subCategory: true }, { "name": "$parentCategoryData.categoryName", "slug": "$parentCategoryData.slug", has_subCategory: false }] },
                                    { case: '$parentCategoryData', then: [{ slug: "all", name: "Categories", has_subCategory: true }, { "name": "$parentCategoryData.categoryName", "slug": "$parentCategoryData.slug", has_subCategory: false }] }
                                ],
                                default: "others"
                            }
                        },
                        has_subCategory: { $cond: { if: { $gt: [{ $size: '$subCategory' }, 0] }, then: true, else: false } },
                    }
                }

            ]);

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },



    save: async (data) => {
        try {
            let save = await CategoryManagement.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            throw e;
        }
    },

    getDocumentCount: async (params) => {
        try {
            let recordCount = await CategoryManagement.countDocuments(params);
            if (!recordCount) {
                return null;
            }
            return recordCount;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let record = await CategoryManagement.findById(id);
            if (record) {
                let recordDelete = await CategoryManagement.findByIdAndUpdate(id, {
                    isDeleted: true
                }, {
                    new: true
                });
                if (!recordDelete) {
                    return null;
                }
                return recordDelete;
            }
        } catch (e) {
            throw e;
        }
    },

    updateById: async (data, id) => {
        try {
            let record = await CategoryManagement.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    },

    getByParamsCustom: async (params) => {
        try {
            let record = await CategoryManagement.aggregate([
                {
                    $match: {
                        $and: [params]
                    }
                },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        status: 0,
                        isDeleted: 0
                    }
                }
            ])
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e
        }
    },

    getAllByParams: async (req) => {
        try {
            let aggregate = CategoryManagement.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: 'Active'
                    }
                },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        status: 0,
                        isDeleted: 0,
                    }
                }
            ])

            // var options = {
            //   page: req.query.page,
            //   limit: req.query.perpage
            // };
            // let record = await CategoryManagement.aggregatePaginate(aggregate, options);
            if (!aggregate) {
                return null;
            }
            return aggregate;
        } catch (e) {
            throw e
        }
    },

    getStats: async () => {
        try {
            let count = await CategoryManagement.find({ "isDeleted": false, "categoryType": 'Service' }).count();
            let activecount = await CategoryManagement.find({ "isDeleted": false, "status": "Active", "categoryType": 'Service' }).count();
            let inactivecount = await CategoryManagement.find({ "isDeleted": false, "status": "Inactive", "categoryType": 'Service' }).count();

            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            throw e;
        }
    },


    getBreakdown: async () => {
        try {
            let record = await CategoryManagement.aggregate([
                {
                    $match: {
                        "isDeleted": false,
                        "status": "Active",
                        "parentCategory": null,
                        "level": 0
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            parentId: '$_id', parentCategory_name: '$categoryName', parentCategory_slug: '$slug'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$parentCategory', '$$parentId']
                                            },
                                            {
                                                $eq: ['$level', 1]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    parentCategory_name: '$$parentCategory_name',
                                    parentCategory_slug: '$$parentCategory_slug'
                                }
                            },
                            {
                                $lookup: {
                                    from: 'categorymanagements',
                                    let: {
                                        parentId: '$_id', parentCategory_name: '$categoryName', parentCategory_slug: '$slug'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        {
                                                            $eq: ['$parentCategory', '$$parentId']
                                                        },
                                                        {
                                                            $eq: ['$level', 2]
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $addFields: {
                                                parentCategory_name: '$$parentCategory_name',
                                                parentCategory_slug: '$$parentCategory_slug'
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: 'categorymanagements',
                                                let: {
                                                    parentId: '$_id', parentCategory_name: '$categoryName', parentCategory_slug: '$slug'
                                                },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $and: [
                                                                    {
                                                                        $eq: ['$parentCategory', '$$parentId']
                                                                    },
                                                                    {
                                                                        $eq: ['$level', 3]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        $addFields: {
                                                            parentCategory_name: '$$parentCategory_name',
                                                            parentCategory_slug: '$$parentCategory_slug'
                                                        }
                                                    },

                                                ],
                                                as: 'childCategory'
                                            }

                                        },


                                    ],
                                    as: 'childCategory'
                                }

                            },

                        ],
                        as: 'childCategory'
                    }

                },


            ]);
            if (!record) {
                return {};
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getReverseTree: async (id) => {
        try {
            let data = await CategoryManagement.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            parentId: '$parentCategory'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$parentId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'categorymanagements',
                                    let: {
                                        parentId: '$parentCategory'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        {
                                                            $eq: ['$_id', '$$parentId']
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: 'categorymanagements',
                                                let: {
                                                    parentId: '$parentCategory'
                                                },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $and: [
                                                                    {
                                                                        $eq: ['$_id', '$$parentId']
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
            
            
                                                ],
                                                as: 'sub_sub_childCategory'
                                            }
            
                                        },
                                        { $unwind: { path: '$sub_sub_childCategory', preserveNullAndEmptyArrays: true } },

                                    ],
                                    as: 'sub_childCategory'
                                }

                            },
                            { $unwind: { path: '$sub_childCategory', preserveNullAndEmptyArrays: true } },

                        ],
                        as: 'childCategory'
                    }

                },
                { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },
            ])

            if (data.length > 0) {
                return data[0]
            } else {
                return {}
            }

        } catch (e) {
            throw e;
        }
    },




    ///////////////////////////////api////////////////////

    getParentCategories: async () => {
        try {
            let data = await CategoryManagement.find({ "isDeleted": false, "status": "Active", "parentCategory": null })
                .select(['_id', 'categoryName', 'categoryType', 'icon']);

            return data;
        } catch (e) {
            throw e;
        }
    },


};

module.exports = CategoryManagementRepo;