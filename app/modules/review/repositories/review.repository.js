const mongoose = require('mongoose');
const Review = require('review/models/review.model');
const perPage = config.other.pageLimit;

const reviewRepo = {
    getAll: async (req) => {

        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });
            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'reviewFor.full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'reviewBy.full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'avgForSearch': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'dateString': { $regex: req.body.search.value.trim(), $options: 'i' } },


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

            var aggregate = Review.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewForId: '$review_for_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewForId']
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
                        as: 'reviewFor'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewFor',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewById: '$review_by_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewById']
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
                        as: 'reviewBy'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewBy',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $addFields: {
                        'avgRating': { $round: [{ $avg: ['$workmanship', '$cost', '$schedule', '$communication'] }, 1] },
                    }
                },
                {
                    $addFields: {
                        'avgForSearch': { $toString: '$avgRating' },
                        'dateString': {
                            $dateToString: {
                                date: '$review_date',
                                format: "%m-%d-%Y",
                            }
                        }
                    },
                },
                sortOperator,
                {
                    $match: conditions
                },
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await Review.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await Review.findById(id).lean().exec();
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
            let record = await Review.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewForId: '$review_for_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewForId']
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
                        as: 'reviewFor'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewFor',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewById: '$review_by_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewById']
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
                        as: 'reviewBy'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewBy',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            jobId: '$service_request_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$jobId']
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    title: 1
                                }
                            }
                        ],
                        as: 'job'
                    }
                },
                {
                    $unwind: {
                        path: '$job',
                        preserveNullAndEmptyArrays: false
                    }
                },
            ])

            console.log('record---', record);
            if (!record) {
                return null;
            }
            return record[0];


        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        try {
            let record = await Review.findOne(params).exec();
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
            let record = await Review.find(params).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllByIdCustom: async (id) => {
        try {
            let record = await Review.aggregate([
                {
                    $match: {
                        "review_for_user_id": id, "isDeleted": false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewById: '$review_by_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewById']
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
                        as: 'reviewBy'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewBy',
                        preserveNullAndEmptyArrays: false
                    }
                },
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
            let save = await Review.create(data);
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
            let recordCount = await Review.countDocuments(params);
            if (!recordCount) {
                return null;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let record = await Review.findById(id);
            if (record) {
                let recordDelete = await Review.findByIdAndUpdate(id, {
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
            let record = await Review.findByIdAndUpdate(id, data, {
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

    updateMany: async (params, data) => {
        try {
            let updatedData = await Review.updateMany(params, { $set: data });
            if (!updatedData) {
                return null;
            }
            return updatedData;
        } catch (err) {
            return err;
        }
    },
    getAllData: async () => {
        let allData = Review.aggregate([
            {
                $match: {
                    'isDeleted': false,
                    'status': 'Active'
                }
            }
        ]);
        if (!allData) {
            return null;
        }
        return allData
    },

    getByParamsCustom: async (param) => {
        try {
            let result = await Review.aggregate([
                { $match: param },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0
                    }
                }
            ])
            if (!result) {
                return null;
            }
            return result;
        } catch (err) {
            throw err;
        }
    },

    getStats: async () => {
        try {
            let count = await Review.find({ "isDeleted": false }).count();
            let activecount = await Review.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Review.find({ "isDeleted": false, "status": "Inactive" }).count();
            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            return e;
        }
    },

    getOverallRating: async () => {
        try {
            let overallRating = await Review.aggregate([
                {
                    $match: {
                        "isDeleted": false
                    }
                },
                {
                    $project: {
                        overallRating: { $divide: [{ $sum: ["$workmanship", "$cost", "$schedule", "$communication"] }, 4] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        average: { $avg: '$overallRating' }
                    }
                }
            ]);

            if (overallRating.length > 0) {
                let roundoff = Math.round((overallRating[0]['average']) * 10) / 10
                return roundoff;
            } else {
                return null;
            }

        } catch (e) {
            return e;
        }
    },

    getAllReview: async (id) => {
        try {
            let recordStat = await Review.aggregate([
                {
                    $match: {
                        "review_for_user_id": id, "isDeleted": false
                    }
                },
                {
                    $project: {
                        overallRating: { $divide: [{ $sum: ["$workmanship", "$cost", "$schedule", "$communication"] }, 4] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        average: { $avg: '$overallRating' },
                        review_count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        overall_average: { $round: ["$average", 1] },
                        review_count: "$review_count"
                    }
                }
            ]);

            let record = await Review.aggregate([
                {
                    $match: {
                        "review_for_user_id": id, "isDeleted": false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            reviewById: '$review_by_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$reviewById']
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
                        as: 'reviewBy'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewBy',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        review_for_user_id: "$review_for_user_id",
                        review_by_user_id: "$review_by_user_id",
                        reviewBy: "$reviewBy.full_name",
                        reviewBy_profile_image: "$reviewBy.profile_image",
                        service_request_id: "$service_request_id",
                        workmanship: "$workmanship",
                        cost: "$cost",
                        schedule: "$schedule",
                        communication: "$communication",
                        average: "$average",
                        review_text: "$review",
                        review_date: "$review_date"
                    }
                }
            ]);

            if (!record) {
                record = null;
            }
            if (recordStat.length > 0) {
                recordStat = recordStat[0];
            }
            return { reviews: record, review_stats: recordStat };

        } catch (e) {
            return e;
        }
    },


    getUserReviewStats: async (id) => {
        try {

            let record = await Review.aggregate([
                {
                    $match: {
                        "review_for_user_id": id, "isDeleted": false
                    }
                },
                {
                    $project: {
                        overallRating: { $divide: [{ $sum: ["$workmanship", "$cost", "$schedule", "$communication"] }, 4] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        average: { $avg: '$overallRating' },
                        review_count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        average: { $round: ["$average", 1] },
                        review_count: "$review_count"
                    }
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


    reviewStat: async (id) => {
        try {

            let record = await Review.aggregate([
                {
                    $match: {
                        "review_for_user_id": id, "isDeleted": false
                    }
                },
                {
                    $addFields: {
                        overallRating: { $divide: [{ $sum: ["$workmanship", "$cost", "$schedule", "$communication"] }, 4] }
                    }
                },
                {
                    $project: {
                        overallRating: '$overallRating',
                        five_star: {
                            $cond: [{ $eq: ['$overallRating', 5] }, 1, 0]
                        },
                        four_star: {
                            $cond: [{ $and: [{ $gte: ['$overallRating', 4] }, { $lt: ['$overallRating', 5] }] }, 1, 0]
                        },
                        three_star: {
                            $cond: [{ $and: [{ $gte: ['$overallRating', 3] }, { $lt: ['$overallRating', 4] }] }, 1, 0]
                        },
                        two_star: {
                            $cond: [{ $and: [{ $gte: ['$overallRating', 2] }, { $lt: ['$overallRating', 3] }] }, 1, 0]
                        },
                        one_star: {
                            $cond: [{ $and: [{ $gte: ['$overallRating', 1] }, { $lt: ['$overallRating', 2] }] }, 1, 0]
                        }

                    }
                },
                {
                    $group: {
                        _id: null,
                        total_average: { $avg: '$overallRating' },
                        total_count: { $sum: 1 },
                        five_star: { $sum: "$five_star" },
                        four_star: { $sum: "$four_star" },
                        three_star: { $sum: "$three_star" },
                        two_star: { $sum: "$two_star" },
                        one_star: { $sum: "$one_star" }
                    }
                },
                {
                    $project: {
                        total_average: { $round: ["$total_average", 1] },
                        total_count: "$total_count",
                        five_star: "$five_star",
                        four_star: "$four_star",
                        three_star: "$three_star",
                        two_star: "$two_star",
                        one_star: "$one_star"
                    }
                }
            ]);


            if (record.length > 0) {
                return record[0];
            } else {
                return {};
            }


        } catch (e) {
            return e;
        }
    },


}

module.exports = reviewRepo;