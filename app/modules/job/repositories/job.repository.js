const mongoose = require('mongoose');
const jobManagement = require('job/models/job.model');
const perPage = config.other.pageLimit;

const jobManagementRepo = {

    getAll: async (req) => {

        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });
            var match_cond = {
                $match: {
                    "isDeleted": false
                }
            }

            if ((req.query.status != "") && req.query.status != null) {
                match_cond = {
                    $match: {
                        "isDeleted": false,
                        "status": req.query.status
                    }
                }
            }


            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'userId.full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'category.categoryName': { $regex: req.body.search.value.trim(), $options: 'i' } },

                        { 'location': { $regex: req.body.search.value.trim(), $options: 'i' } }


                    ]
                });
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
                sortOperator["$sort"]['_id'] = -1;
            }

            var aggregate = jobManagement.aggregate([
                match_cond,
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
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
                                    full_name: 1
                                }
                            }
                        ],
                        as: 'userId'
                    }
                },
                {
                    $unwind: {
                        path: '$userId'
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            categoryId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$categoryId']
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
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category'
                    }
                },
                {
                    $match: conditions
                },
                sortOperator
            ]);

            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await jobManagement.aggregatePaginate(aggregate, options);
            // console.log(allRecord);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await jobManagement.findById(id).lean().exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getByIdCustom: async (id) => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    email: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            catId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$catId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    categoryName: 1,
                                    categoryType: 1
                                }
                            }
                        ],
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: false
                    }
                }
            ]);
            
            if (record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            return e;
        }
    },

    getJobDetailsById: async (req) => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        $and: [{
                            isDeleted: false,
                            status: 'Active',
                            _id: mongoose.Types.ObjectId(req.params.id)
                        }]
                    }
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            userId: req.user._id, jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$proposal_from', '$$userId']

                                            },
                                            {
                                                $eq: ['$job_id', '$$jobId']

                                            }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'proposals'
                    }
                },
                {
                    $unwind: {
                        path: '$proposals',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            {
                                                $eq: ['$job_id', '$$jobId']

                                            },
                                            {
                                                $eq: ['$proposal_status', 'Accepted']

                                            }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'proposal_detail'
                    }
                },
                {
                    $unwind: {
                        path: '$proposal_detail',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            myId: req.user._id
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$myId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: '$_id',
                                    full_name: '$full_name',
                                    profile_image: '$profile_image',
                                    project_inprogress: "5",
                                    project_awarded: "5",
                                    pending_proposals: "10",
                                    earnings: "800"
                                }
                            }
                        ],
                        as: 'myData'
                    }
                },
                {
                    $unwind: {
                        path: '$myData',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    full_name: 1,
                                    profile_image: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            catId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$catId']
                                            }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'categoryLookUp'
                    }
                },
                {
                    $unwind: {
                        path: '$categoryLookUp',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'regions',
                        let: {
                            regionId: '$region'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$regionId']
                                            }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'regionLookUp'
                    }
                },
                {
                    $unwind: {
                        path: '$regionLookUp',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'cities',
                        let: {
                            district: '$district'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$district']
                                            }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'city'
                    }
                },
                {
                    $unwind: {
                        path: '$city',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'suburbs',
                        let: {
                            suburbId: '$suburb'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$suburbId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    suburbName: 1
                                }
                            }
                        ],
                        as: 'suburbLookUp'
                    }
                },
                {
                    $unwind: {
                        path: '$suburbLookUp',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'transactions',
                        let: {
                            jobid: mongoose.Types.ObjectId(req.params.id)
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$jobId', '$$jobid']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: '$jobId',
                                    total_funded: { $sum: '$amount'} 
                                }
                            }
                        ],
                        as: 'transactions'
                    }
                },
                {
                    $unwind: {
                        path: '$transactions',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        user_details: '$user',
                        is_completed: '$is_completed',
                        client_id: '$user._id',
                        servicer_id: '$proposal_detail.proposal_from',
                        categoryName: '$categoryLookUp.categoryName',
                        categoryType: '$categoryLookUp.categoryType',
                        regionId: '$regionLookUp._id',
                        regionName: '$regionLookUp.regionName',
                        cityId: '$city._id',
                        cityName: '$city.cityName',
                        email: '$email',
                        title: '$title',
                        description: '$description',
                        postDate: '$createdAt',
                        location: '$location',
                        files: '$files',
                        description_attachment: '$description_attachment',
                        budget: '$budget',
                        deadline: { $cond: { if: '$deadline', then: '$deadline', else: '' } },
                        openForBid: '$openForBid',
                        my_data: '$myData',
                        proposal_sent: { $cond: { if: '$proposals', then: true, else: false } },
                        proposal_id: { $cond: { if: '$proposals', then: '$proposals._id', else: 
                        { $cond: { if: { $eq: [req.user._id, '$userId'] }, then: '$proposal_detail._id', else: '' } } } },
                        proposed_amount: '$proposal_detail.rate',
                        proposed_estimated_days: '$proposal_detail.estimated_days',
                        my_project: { $cond: { if: { $eq: [req.user._id, '$userId'] }, then: true, else: false } },
                        funded: { $cond: { if: '$transactions', then: '$transactions.total_funded', else: 0 } }
                    }
                }
            ])

            // console.log("your log---->",record);
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e
        }
    },

    getBasicJobDetail: async (id) => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1
                                }
                            }
                        ],
                        as: 'user_details'
                    }
                },
                {
                    $unwind: {
                        path: '$user_details',
                        preserveNullAndEmptyArrays: false
                    }
                }

            ]);
            
            if (record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            return e;
        }
    },


    getByField: async (params) => {
        try {
            let record = await jobManagement.findOne(params).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            let record = await jobManagement.find(params).sort({
                'title': 1
            }).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllByCategoryServicer: async () => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: "Active",
                        notified: false
                    }
                },
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            catId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$catId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    categoryName: 1,
                                    categoryType: 1,
                                }
                            }
                        ],
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            catId: '$category._id'
                        },
                        pipeline: [
                            {
                                "$match": {
                                    $expr: {
                                        "$in": [
                                            "$$catId",
                                            {
                                                "$ifNull": [
                                                    "$category",
                                                    []
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $project: {
                        job_id: "$_id",
                        title: "$title",
                        servicer_id: "$user._id",
                        user_id: "$userId",
                        category: "$category.categoryName"
                    }
                }
                // {
                //     $unwind: {
                //         path: '$user',
                //         preserveNullAndEmptyArrays: false
                //     }
                // },


            ]);
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },



    save: async (data) => {
        try {
            let save = await jobManagement.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            return e;
        }
    },

    getDocumentCount: async (params) => {
        try {
            let recordCount = await jobManagement.countDocuments(params);
            // if (!recordCount) {
            //     return null;
            // }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let record = await jobManagement.findById(id);
            if (record) {
                let recordDelete = await jobManagement.findByIdAndUpdate(id, {
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
            let record = await jobManagement.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            return e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    },

    getByParamsCustom: async (params) => {
        try {
            let record = await jobManagement.aggregate([
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
            let aggregate = jobManagement.aggregate([
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
            // let record = await jobManagement.aggregatePaginate(aggregate, options);
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

            var aggregates = await jobManagement.aggregate([

                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
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
                                    full_name: 1
                                }
                            }
                        ],
                        as: 'userId'
                    }
                },
                {
                    $unwind: {
                        path: '$userId'
                    }
                }
            ]);
            var activedata = await aggregates.filter(function (el) {
                let filter_data = el.status == 'Active'
                return filter_data;
            });

            var inactivedata = await aggregates.filter(function (el) {
                let filter_data = el.status == 'Inactive'
                return filter_data;
            });

            return {
                count: aggregates.length,
                activecount: activedata.length,
                inactivecount: inactivedata.length
            };
        } catch (e) {
            return e;
        }
    },


    getAllByFieldCustom: async (params, userId) => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: params
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            userId: '$userId', jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$proposal_from', '$$userId']

                                            },
                                            {
                                                $eq: ['$job_id', '$$jobId']

                                            }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'proposals'
                    }
                },
                {
                    $unwind: {
                        path: '$proposals',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$userId']

                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1,
                                    time_zone: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        client_name: '$user.full_name',
                        client_profile_pic: '$user.profile_image',
                        email: 1,
                        category: 1,
                        title: 1,
                        description: 1,
                        postDate: '$createdAt',
                        location: 1,
                        files: 1,
                        description_attachment: 1,
                        budget: 1,
                        openForBid: 1,
                        createdAt: 1,
                        sent_proposal: { $cond: { if: '$proposals', then: true, else: false } },
                        my_project: { $cond: { if: { $eq: [userId, '$userId'] }, then: true, else: false } },
                    }
                }

            ]);

            return record;

        } catch (e) {
            return e;
        }
    },

    getRecentJobs: async () => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: 'Active'
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        category: 1,
                        title: 1,
                        description_attachment: 1
                    }
                },
                {
                    $limit: 6
                }
            ])
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllJobByCategory: async (req) => {
        try {
            let geoCondition = {
                $match: {
                    isDeleted: false
                }
            }

            let condition2 = {};

            if (req.body.city != null && req.body.city != undefined && req.body.city != "" && (req.body.city).constructor === Array) {
                condition2['city.cityName'] = { $in: req.body.city }
            }

            if (req.body.title && req.body.title != null && req.body.title != undefined && req.body.title != "") {
                condition2['title'] = { $regex: req.body.title.trim(), $options: 'i' }
            }

            // if (req.body.location && req.body.location != null && req.body.location != undefined && req.body.location != "") {
            //     geoCondition = {
            //         $geoNear: {
            //             near: {
            //                 type: "Point",
            //                 coordinates: [
            //                     req.body.location.lat,
            //                     req.body.location.lng
            //                 ]
            //             },
            //             distanceField: "dist.calculated",
            //             maxDistance: 10,
            //             spherical: true
            //         }
            //     }

            // }

            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                if (req.body.price.gt != null && req.body.price.lt != null) {
                    condition2['budget'] = { $gte: parseInt(req.body.price.gt), $lte: parseInt(req.body.price.lt) }
                } else if (req.body.price.gt != null && req.body.price.lt == null) {
                    condition2['budget'] = { $gte: parseInt(req.body.price.gt) }
                } else if (req.body.price.gt == null && req.body.price.lt != null) {
                    condition2['budget'] = { $lte: parseInt(req.body.price.gt) }
                } else {
                    console.log("Invalid price params");
                }
            }

            let record = await jobManagement.aggregate([
                // geoCondition,
                {
                    $match: {
                        category: req.body.catId,
                        isDeleted: false,
                        status: 'Active',
                        openForBid: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$userId']

                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: '$profile_image',
                                    bio: 1,
                                    // geo_loc: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'cities',
                        let: {
                            district: '$district'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$district']
                                            }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'city'
                    }
                },
                {
                    $unwind: {
                        path: '$city',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: condition2
                },
                {
                    $project: {
                        category: 1,
                        title: 1,
                        description_attachment: 1,
                        district: 1,
                        budget: 1,
                        district: '$city.cityName',
                        user: '$user'
                    }
                }
            ])
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    pendingProposal: async (id) => {
        try {
            let aggregate = await jobManagement.aggregate([
                {
                    $match: {
                        userId: id,
                        isDeleted: false,
                        status: 'Active',
                        openForBid: true
                    }
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            {
                                                $eq: ['$job_id', '$$jobId']

                                            },
                                            {
                                                $eq: ['$proposal_status', 'Pending']

                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }

                        ],
                        as: 'proposal_detail'
                    }
                },
                {
                    $unwind: {
                        path: '$proposal_detail',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        count: '$proposal_detail.count'
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: '$count' }
                    }
                }

            ]);


            if (aggregate.length > 0) {
                return aggregate[0];
            } else {
                return null;
            }
            
        } catch (e) {
            throw e
        }
    },



    pendingProposal: async (id) => {
        try {
            let aggregate = await jobManagement.aggregate([
                {
                    $match: {
                        userId: id,
                        isDeleted: false,
                        status: 'Active',
                        openForBid: true
                    }
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            {
                                                $eq: ['$job_id', '$$jobId']

                                            },
                                            {
                                                $eq: ['$proposal_status', 'Pending']

                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }

                        ],
                        as: 'proposal_detail'
                    }
                },
                {
                    $unwind: {
                        path: '$proposal_detail',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        count: '$proposal_detail.count'
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: '$count' }
                    }
                }

            ]);


            if (aggregate.length > 0) {
                return aggregate[0];
            } else {
                return null;
            }
            
        } catch (e) {
            throw e
        }
    },


    jobPaidout: async (id) => {
        try {
            let aggregate = await jobManagement.aggregate([
                {
                    $match: {
                        userId: id,
                        isDeleted: false,
                        status: 'Active',
                        openForBid: false
                    }
                },
                {
                    $lookup: {
                        from: 'transactions',
                        let: {
                            jobId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            {
                                                $eq: ['$jobId', '$$jobId']

                                            },
                                            {
                                                $eq: ['$paymentStatus', 'succeeded']

                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    total_paid: { $sum: '$amount' }
                                }
                            }

                        ],
                        as: 'transaction'
                    }
                },
                {
                    $unwind: {
                        path: '$transaction',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        paid_out: { $sum: '$transaction.total_paid'}
                    }
                }


            ]);


            if (aggregate.length > 0) {
                return aggregate[0];
            } else {
                return null;
            }
            
        } catch (e) {
            throw e
        }
    },



    getAllJobInvoices: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

            if (req.query.stat && req.query.stat !== null && req.query.stat !== "") {
                if (req.query.stat == "Paid") {
                    and_clauses.push({
                        $or: [
                            { 'payment_status': 'Paid' },
                            
                        ]
                    })
                } else {
                    and_clauses.push({
                        $or: [
                            { 'payment_status': { $ne: 'Paid' } },
                            
                        ]
                    })
                }

            }
            conditions['$and'] = and_clauses;

            let record = await jobManagement.aggregate([
                {
                    $match: {
                        userId: req.user._id,
                        isDeleted: false,
                        status: 'Active'
                    }
                },
                {
                    $lookup: {
                        from: 'milestones',
                        let: {
                            job_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$job_id', '$$job_id']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        uid: '$created_by'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        {
                                                            $eq: ['$_id', '$$uid']
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        
                                    ],
                                    as: 'servicer_user'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$servicer_user',
                                    preserveNullAndEmptyArrays: false
                                }
                            },
                            
                        ],
                        as: 'milestones'
                    }
                },
                {
                    $unwind: {
                        path: '$milestones',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        job_title: '$title',
                        milestone_id: '$milestones._id',
                        milestone_name: '$milestones.name',
                        milestone_description: '$milestones.description',
                        amount: '$milestones.amount',
                        updatedAt: '$milestones.updatedAt',
                        payment_status: '$milestones.payment_status',
                        receiver_name: '$milestones.servicer_user.full_name',
                        isDeleted: '$isDeleted'
                    }
                },
                {
                    $match: conditions
                }
                
            ]);


            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getUserDetail: async (req) => {
        try {
            let record = await jobManagement.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$userId', '$$userId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    count:  { $sum: 1}
                                }
                            }
                        ],
                        as: 'alljobs'
                    }
                },
                {
                    $unwind: {
                        path: '$alljobs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$userId', '$$userId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            },
                                            {
                                                $eq: ['$is_completed', false]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    count:  { $sum: 1}
                                }
                            }
                        ],
                        as: 'openJobs'
                    }
                },
                {
                    $unwind: {
                        path: '$openJobs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        location: '$user.location',
                        geo_loc: '$user.geo_loc',
                        rate_per_hr: '$user.rate_per_hr',
                        time_zone: '$user.time_zone',
                        member_since: '$user.createdAt',
                        total_posted: '$alljobs.count',
                        open_jobs: '$openJobs.count'
                    }
                }
                
            ]);

            if (record && record.length > 0) {
                return record[0];
            } else {
                return {};
            }
            
        } catch (e) {
            return e;
        }
    },


};

module.exports = jobManagementRepo;