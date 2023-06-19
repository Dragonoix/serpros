const mongoose = require('mongoose');
const Transaction = require('transaction/models/transaction.model');
const perPage = config.other.pageLimit;

const transactionRepo = {
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
                        { 'paymentStatus': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'payee.full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'payer.full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'paymentStatus': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'dateString': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'trans_id': { $regex: req.body.search.value.trim(), $options: 'i' } }

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

            var aggregate = Transaction.aggregate([

                {
                    $lookup: {
                        from: 'users',
                        let: {
                            payerId: '$payer'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$payerId']
                                            },
                                            // {
                                            //     $eq: ['$isDeleted', false]
                                            // },
                                            // {
                                            //     $eq: ['$status', 'Active']
                                            // }
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
                        as: 'payer'
                    }
                },
                {
                    $unwind: {
                        path: '$payer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            payeeId: '$payee'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$payeeId']
                                            },
                                            // {
                                            //     $eq: ['$isDeleted', false]
                                            // },
                                            // {
                                            //     $eq: ['$status', 'Active']
                                            // }
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
                        as: 'payee'
                    }
                },
                {
                    $unwind: {
                        path: '$payee',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        transDate: '$trans_date'
                    },
                },
                {

                    $addFields:
                    {
                        dateString: {
                            $dateToString: {
                                date: '$transDate',
                                format: "%m-%d-%Y",
                            }
                        }
                    }
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
            let allRecord = await Transaction.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await Transaction.findById(id).lean().exec();
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
            let record = await Transaction.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            payerId: '$payer'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$payerId']
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
                        as: 'payer'
                    }
                },
                {
                    $unwind: {
                        path: '$payer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            payeeId: '$payee'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$payeeId']
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
                        as: 'payee'
                    }
                },
                {
                    $unwind: {
                        path: '$payee',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            serviceId: '$serviceId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$serviceId']
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
                        as: 'service'
                    }
                },
                {
                    $unwind: {
                        path: '$service',
                        preserveNullAndEmptyArrays: true
                    }
                },
            ])
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
            let record = await Transaction.findOne(params).exec();
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
            let record = await Transaction.find(params).sort({
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



    save: async (data) => {
        try {
            let save = await Transaction.create(data);
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
            let recordCount = await Transaction.countDocuments(params);
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
            let record = await Transaction.findById(id);
            if (record) {
                let recordDelete = await Transaction.findByIdAndUpdate(id, {
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
            let record = await Transaction.findByIdAndUpdate(id, data, {
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
            let updatedData = await Transaction.updateMany(params, { $set: data });
            if (!updatedData) {
                return null;
            }
            return updatedData;
        } catch (err) {
            return err;
        }
    },
    getAllData: async () => {
        let allData = Transaction.aggregate([
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
            let result = await Transaction.aggregate([
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
            let count = await Transaction.find({ "isDeleted": false }).count();
            let activecount = await Transaction.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Transaction.find({ "isDeleted": false, "status": "Inactive" }).count();
            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            return e;
        }
    },


    getRevenue: async () => {
        try {
            let revenue = await Transaction.aggregate([
                {
                    $match: { "isDeleted": false }
                },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ]);
            if (revenue.length > 0) {
                return revenue[0]['amount'];
            } else {
                return 0;
            }

        } catch (e) {
            return e;
        }
    },

    getAllSuccessTransactionById: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

            if ((_.has(req.body, "fromDt") && _.has(req.body, "toDt")) && (req.body.fromDt != null && req.body.toDt != null)) {
                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gt: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                                $lt: new Date(req.body.toDt) //"2023-02-24T00:00:00.000Z"
                            }
                        }

                    ]
                });
            }

            if ((_.has(req.body, "fromDt")) && (req.body.fromDt != null)) {

                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gte: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                            }
                        }

                    ]
                });
            }

            conditions['$and'] = and_clauses;


            var allSuccesstransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        paymentStatus: "succeeded"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] },
                                            { $eq: ['$userId', req.user._id] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: conditions
                },
                {
                    $project: {
                        trans_date: '$trans_date',
                        description: '$description',
                        amount: '$amount',
                        isDeleted: 1
                    }
                },


            ]);



            return (allSuccesstransaction);
        } catch (e) {
            return e;
        }
    },


    getAllTransactionById: async (req) => {
        var conditions = {};
        var and_clauses = [];
        and_clauses.push({
            "isDeleted": false,
        });

        if ((_.has(req.body, "fromDt") && _.has(req.body, "toDt")) && (req.body.fromDt != null && req.body.toDt != null)) {

            and_clauses.push({
                $or: [
                    {
                        trans_date: {
                            $gt: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                            $lt: new Date(req.body.toDt) //"2023-02-24T00:00:00.000Z"
                        }
                    }

                ]
            });
        }

        if ((_.has(req.body, "fromDt")) && (req.body.fromDt != null)) {

            and_clauses.push({
                $or: [
                    {
                        trans_date: {
                            $gte: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                        }
                    }

                ]
            });
        }

        conditions['$and'] = and_clauses;


        try {
            var alltransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] },
                                            { $eq: ['$userId', req.user._id] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: conditions
                },
                {
                    $project: {
                        trans_date: '$trans_date',
                        description: '$description',
                        amount: '$amount',
                        paymentStatus: '$paymentStatus',
                        isDeleted: 1
                    }
                },


            ]);
            return (alltransaction);

        } catch (e) {
            return e;
        }
    },


    transactionByIdStat: async (req) => {
        try {

            var alltransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        paymentStatus: "succeeded"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] },
                                            { $eq: ['$userId', req.user._id] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        createdAt: '$createdAt',
                        // description: '$description',
                        amount: '$amount',
                        // isDeleted: 1
                    }
                },

            ]);

            return alltransaction;
        } catch (e) {
            return e;
        }
    },


    getAllServicerSuccessTransaction: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

            if ((_.has(req.body, "fromDt") && _.has(req.body, "toDt")) && (req.body.fromDt != null && req.body.toDt != null)) {

                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gt: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                                $lt: new Date(req.body.toDt) //"2023-02-24T00:00:00.000Z"
                            }
                        }

                    ]
                });
            }

            if ((_.has(req.body, "fromDt")) && (req.body.fromDt != null)) {

                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gte: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                            }
                        }
                    ]
                });
            }

            conditions['$and'] = and_clauses;


            var allSuccesstransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        paymentStatus: "succeeded"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] },
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'proposals',
                                    let: {
                                        job_Id: '$_id'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$job_id', '$$job_Id'] },
                                                        { $eq: ['$proposal_from', req.user._id] },
                                                        { $eq: ['$proposal_status', 'Accepted'] }
                                                    ]
                                                }
                                            }
                                        },

                                    ],
                                    as: 'proposal'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$proposal',
                                    preserveNullAndEmptyArrays: false
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: conditions
                },
                {
                    $project: {
                        trans_date: '$trans_date',
                        description: '$description',
                        amount: '$amount',
                        isDeleted: 1
                    }
                }


            ]);

            

            return allSuccesstransaction;
        } catch (e) {
            return e;
        }
    },

    getAllServicerTransaction: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

            if ((_.has(req.body, "fromDt") && _.has(req.body, "toDt")) && (req.body.fromDt != null && req.body.toDt != null)) {
                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gt: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                                $lt: new Date(req.body.toDt) //"2023-02-24T00:00:00.000Z"
                            }
                        }
                    ]
                });
            }

            if ((_.has(req.body, "fromDt")) && (req.body.fromDt != null)) {

                and_clauses.push({
                    $or: [
                        {
                            trans_date: {
                                $gte: new Date(req.body.fromDt), //"2023-02-20T00:00:00.000Z"
                            }
                        }

                    ]
                });
            }

            conditions['$and'] = and_clauses;


            

            var alltransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'proposals',
                                    let: {
                                        job_Id: '$_id'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$job_id', '$$job_Id'] },
                                                        { $eq: ['$proposal_from', req.user._id] },
                                                        { $eq: ['$proposal_status', 'Accepted'] }
                                                    ]
                                                }
                                            }
                                        },

                                    ],
                                    as: 'proposal'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$proposal',
                                    preserveNullAndEmptyArrays: false
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: conditions
                },
                {
                    $project: {
                        trans_date: '$trans_date',
                        description: '$description',
                        amount: '$amount',
                        paymentStatus: '$paymentStatus',
                        isDeleted: 1
                    }
                },


            ]);


            return alltransaction;
        } catch (e) {
            return e;
        }
    },


    servicerTransactionByIdStat: async (req) => {
        try {

            var alltransaction = await Transaction.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        paymentStatus: "succeeded"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            job_Id: '$jobId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$job_Id'] },
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'proposals',
                                    let: {
                                        job_Id: '$_id'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$job_id', '$$job_Id'] },
                                                        { $eq: ['$proposal_from', req.user._id] },
                                                        { $eq: ['$proposal_status', 'Accepted'] }
                                                    ]
                                                }
                                            }
                                        },

                                    ],
                                    as: 'proposal'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$proposal',
                                    preserveNullAndEmptyArrays: false
                                }
                            },

                        ],
                        as: 'jobDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$jobDetail',
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        createdAt: '$createdAt',
                        amount: '$amount',
                    }
                },

            ]);

            return alltransaction;
        } catch (e) {
            return e;
        }
    },

}

module.exports = transactionRepo;