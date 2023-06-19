const mongoose = require('mongoose');
const Proposal = require('proposal/models/proposal.model');
const perPage = config.other.pageLimit;

const proposalRepo = {

    getAll: async (req) => {

        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

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

            var aggregate = Proposal.aggregate([
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await Proposal.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await Proposal.findById(id).lean().exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        try {
            let record = await Proposal.findOne(params).exec();
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
            let record = await Proposal.find(params).sort({
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
            let save = await Proposal.create(data);
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
            let recordCount = await Proposal.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let record = await Proposal.findById(id);
            if (record) {
                let recordDelete = await Proposal.findByIdAndUpdate(id, {
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
            let record = await Proposal.findByIdAndUpdate(id, data, {
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
            let record = await Proposal.aggregate([
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
            let aggregate = Proposal.aggregate([
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
            let count = await Proposal.find({ "isDeleted": false }).count();
            let activecount = await Proposal.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Proposal.find({ "isDeleted": false, "status": "Inactive" }).count();

            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            return e;
        }
    },

    getAllByFieldCustom: async (params) => {
        try {
            let record = await Proposal.aggregate([
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            jobId: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$jobId']

                                    }
                                }
                            }
                        ],
                        as: 'job'
                    }
                },
                {
                    $unwind: {
                        path: '$job',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'chatrooms',
                        let: {
                            jobId: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$job_id', '$$jobId']

                                    }
                                }
                            },


                        ],
                        as: 'chatroom'
                    }
                },
                {
                    $unwind: {
                        path: '$chatroom',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$job.userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$userId']

                                    }
                                }
                            },


                        ],
                        as: 'job_postedby'
                    }
                },
                {
                    $unwind: {
                        path: '$job_postedby',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$proposal_from'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$userId']

                                    }
                                }
                            },


                        ],
                        as: 'proposedBy'
                    }
                },
                {
                    $unwind: {
                        path: '$proposedBy',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        logged_in_user: { $cond: [{ $eq: ['$job_postedby._id', params.logged_in_user] }, "$job_postedby._id", "$proposal_from"] }
                    }
                },
                { $match: params },
                {
                    $project: {
                        proposedby_name: "$proposedBy.full_name",
                        proposedby_profile_image: "$proposedBy.profile_image",
                        job_postedby_name: "$job_postedby.full_name",
                        job_postedby_profile_image: "$job_postedby.profile_image",
                        job_id: "$job_id",
                        job_title: "$job.title",
                        my_proposal_amt: "$rate",
                        budget: "$job.budget",
                        proposal_status: "$proposal_status",
                        room: '$chatroom._id',
                        room_status: "$chatroom.status",

                    }
                }

            ]);

            return record;

        } catch (e) {
            return e;
        }
    },

    getDetailByField: async (params) => {
        try {
            let record = await Proposal.aggregate([
                { $match: { $and: [params] } },
                {
                    $lookup: {
                        from: 'jobs',
                        let: { jobId: '$job_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$jobId']
                                    }
                                }
                            },
                            {
                                $project: {
                                    isDeleted: 0
                                }
                            }
                        ],
                        as: 'job_data'
                    }
                },
                {
                    $unwind: {
                        path: "$job_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { userId: '$job_data.userId' },
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
                                    first_name: 1,
                                    last_name: 1,
                                    full_name: 1,
                                    user_type: 1,
                                    email: 1,
                                    profile_image: 1,
                                    cover_image: 1
                                }
                            }
                        ],
                        as: 'posted_by_data'
                    }
                },
                {
                    $unwind: {
                        path: '$posted_by_data',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { userId: '$proposal_from' },
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
                                    first_name: 1,
                                    last_name: 1,
                                    full_name: 1,
                                    user_type: 1,
                                    email: 1,
                                    profile_image: 1,
                                    cover_image: 1
                                }
                            }
                        ],
                        as: 'proposal_from_data'
                    }
                },
                {
                    $unwind: {
                        path: '$proposal_from_data',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "proposal_from": "$proposal_from",
                        "rate": "$rate",
                        "estimated_days": "$estimated_days",
                        "description": "$description",
                        "image": "$image",
                        "job_id": "$job_id",
                        "proposal_status": "$proposal_status",
                        "job_posted_by": "$posted_by_data",
                        "proposal_from": "$proposal_from_data",
                        "job_data": "$job_data",
                        "createdAt": "$createdAt"
                    }
                }
            ])

            if (record && record.length) {
                return record[0];
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    },

    acceptedJobByUser: async (userId) => {
        try {
            let record = await Proposal.aggregate([
                {
                    $match: {
                        proposal_from: userId,
                        isDeleted: false,
                        status: 'Active',
                        proposal_status: 'Accepted'
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: { jobId: '$job_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$jobId']
                                    }
                                }
                            },
                            {
                                $project: {
                                    userId: 1,
                                    category: 1,
                                    title: 1,
                                    description: 1,
                                    postDate: 1,
                                    files: 1,
                                    description_attachment: 1,
                                    budget: 1,
                                    deadline: 1,
                                    openForBid: 1
                                }
                            }

                        ],
                        as: 'job'
                    }
                },
                {
                    $unwind: {
                        path: '$job',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'milestones',
                        let: { jobId: '$job_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$job_id', '$$jobId']
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
                                    name: 1,
                                    description: 1,
                                    due_date: 1,
                                    amount: 1,
                                    created_by: 1,
                                    completed_by_user_id: 1,
                                    milestone_status: 1,
                                    payment_request: 1,
                                    createdAt: 1
                                }
                            }

                        ],
                        as: 'milestones'
                    }
                },
                {
                    $project: {
                        proposal_from: '$proposal_from',
                        rate: '$rate',
                        estimated_days: '$estimated_days',
                        description: '$description',
                        image: '$image',
                        job_id: '$job_id',
                        proposal_status: '$proposal_status',
                        job: '$job',
                        milestones: '$milestones'
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

    getExpertProviders: async () => {
        try {
            let aggregate = Proposal.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: 'Active',
                        proposal_status: "Accepted"
                    }
                },
                {
                    $group: {
                        _id: '$proposal_from',
                        service_count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { proposalFromID: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$proposalFromID']
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'skills',
                                    let: { skillIDs: '$skills' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $in: ['$_id', '$$skillIDs']
                                                }
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                skills: { $push: '$skill' }
                                            }
                                        }


                                    ],
                                    as: 'skill'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$skill',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'reviews',
                                    let: { userID: '$_id' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$review_for_user_id', '$$userID']
                                                }
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                overall_average: { $avg: '$average' },
                                                review_count: { $sum: 1 }
                                            }
                                        }


                                    ],
                                    as: 'review'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$review',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1,
                                    location: 1,
                                    rate_per_hr: 1,
                                    bio: '$bio',
                                    skills: '$skill.skills',
                                    overall_average: { $cond: { if: '$review.overall_average', then: { $round: ['$review.overall_average', 1] }, else: 0 } },
                                    review_count: { $cond: { if: '$review.review_count', then: '$review.review_count', else: 0 } }
                                }
                            }

                        ],
                        as: 'user_details'
                    }
                },
                {
                    $unwind: {
                        path: '$user_details',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        service_count: -1
                    }
                }

            ])


            if (!aggregate) {
                return null;
            }
            return aggregate;
        } catch (e) {
            throw e
        }
    },


    myEarnings: async (id) => {
        try {
            let aggregate = await Proposal.aggregate([
                {
                    $match: {
                        proposal_from: id,
                        isDeleted: false,
                        status: 'Active',
                        proposal_status: "Accepted"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            jobId: '$job_id'
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
                                    _id: 1
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

                        ],
                        as: 'job'
                    }
                },
                {
                    $unwind: {
                        path: '$job',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        earnings: { $sum: '$job.transaction.total_paid' }
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


    inProgress: async (id) => {
        try {
            let aggregate = await Proposal.aggregate([
                {
                    $match: {
                        proposal_from: id,
                        isDeleted: false,
                        status: 'Active',
                        proposal_status: "Accepted"
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            jobId: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            {
                                                $eq: ['$_id', '$$jobId']

                                            },
                                            {
                                                $eq: ['$openForBid', false]

                                            },
                                            {
                                                $eq: ['$is_completed', false]
                                            }
                                        ]
                                    }
                                }
                            },


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
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
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


};

module.exports = proposalRepo;