const mongoose = require('mongoose');
const MilestoneInfo = require('milestones/models/milestones.model');

const perPage = config.PAGINATION_PERPAGE;

const MilestoneRepository = {

    getAll: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false
            });


            conditions['$and'] = and_clauses;

            var sortOperator = {
                "$sort": {}
            };
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }

            var aggregate = MilestoneInfo.aggregate([

                {
                    $project: {
                        _id: "$_id",
                        service_request_id: "$service_request_data._id",
                        name: "$name",
                        date: "$date",
                        milestone_status: "$milestone_status",
                        status: "$status",
                        isDeleted: "$isDeleted"
                    }
                },
                {
                    $match: conditions
                },
                sortOperator
            ]);

            var options = {
                page: req.body.pagination.page,
                limit: req.body.pagination.perpage
            };
            let allRecord = await MilestoneInfo.aggregatePaginate(aggregate, options);

            return allRecord;
        } catch (e) {
            return (e);
        }
    },


    getById: async (id) => {

        try {
            let record = await MilestoneInfo.findById(id).lean().exec();

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
            let record = await MilestoneInfo.findOne(params).exec();

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
            let record = await MilestoneInfo.find(params).exec();

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
            let save = await MilestoneInfo.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            console.log(e);
            return e;
        }
    },




    delete: async (id) => {
        try {
            let record = await MilestoneInfo.findById(id);
            if (record) {
                let recordDelete = await MilestoneInfo.findByIdAndUpdate(id, {
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
            return e;
        }
    },

    updateById: async (id, data) => {
        try {
            let record = await MilestoneInfo.findByIdAndUpdate(id, data, {
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

    updateMany: async (params, data) => {
        try {
            let record = await MilestoneInfo.updateMany(params, data);
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            return e;
        }
    },


    updateByField: async (params, data) => {
        try {
            let record = await MilestoneInfo.update(params, data, {
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

    getDocumentCount: async (params) => {
        try {
            let recordCount = await MilestoneInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },



    AccpetedMilestoneList: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({});

            conditions['$and'] = and_clauses;

            var aggregate = MilestoneInfo.aggregate([
                {
                    $match: { milestone_status: 'Accept', "service_request_id": mongoose.Types.ObjectId(req.query.service_request_id), "isDeleted": false }
                },
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "milestone_id",
                        as: "paymentData"
                    }
                },
                { $unwind: { path: "$paymentData", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: "$_id",
                        user_id: "$user_id",
                        service_request_id: "$service_request_id",
                        name: "$name",
                        start_date: "$start_date",
                        end_date: "$end_date",
                        amount: "$amount",
                        due_amount: { $cond: { if: "$paymentData.payment_amount", then: { $subtract: ["$amount", "$paymentData.payment_amount"] }, else: "$amount" } },
                        created_by: "$created_by",
                        milestone_status: "$milestone_status",
                        status: "$status",
                        isDeleted: "$isDeleted",
                    }
                },
            ]);

            return aggregate;
        } catch (e) {
            return (e);
        }
    },



    AccpetedCompletedMilestoneList: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({

            });

            conditions['$and'] = and_clauses;

            var aggregate = MilestoneInfo.aggregate([
                {
                    $match: {
                        $or: [{ milestone_status: 'Accept' }, { milestone_status: 'Completed' }],
                        "service_request_id": mongoose.Types.ObjectId(req.query.service_request_id)
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        user_id: "$user_id",
                        service_request_id: "$service_request_id",
                        name: "$name",
                        start_date: "$start_date",
                        end_date: "$end_date",
                        amount: "$amount",
                        created_by: "$created_by",
                        milestone_status: "$milestone_status",
                        status: "$status",
                        isDeleted: "$isDeleted"
                    }
                },
            ]);

            return aggregate;
        } catch (e) {
            return (e);
        }
    },




    PendingMilestoneListByUser: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({});
            conditions['$and'] = and_clauses;

            var aggregate = MilestoneInfo.aggregate([
                {
                    $match: {
                        $or: [{ milestone_status: 'Pending' }, { milestone_status: 'Processing' }],
                        "service_request_id": mongoose.Types.ObjectId(req.query.service_request_id), "isDeleted": false
                    },
                },
                {
                    $lookup: {
                        from: "milestone_action_reasons",
                        localField: "_id",
                        foreignField: "milestone_id",
                        as: "milestone_action_reasons"
                    }
                },
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "milestone_id",
                        as: "paymentData"
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        user_id: "$user_id",
                        service_request_id: "$service_request_id",
                        name: "$name",
                        start_date: "$start_date",
                        end_date: "$end_date",
                        amount: "$amount",
                        due_amount: { $cond: { if: {$sum: "$paymentData.payment_amount"}, then: { $subtract: ["$amount", {$sum: "$paymentData.payment_amount"}] }, else: "$amount" } },
                        payment_count: "$payment_count",
                        created_by: "$created_by",
                        milestone_status: "$milestone_status",
                        status: "$status",
                        payment_request: "$payment_request",
                        isDeleted: "$isDeleted",
                        milestone_action: "$milestone_action_reasons"
                    }
                }
            ]);


            return aggregate;
        } catch (e) {
            return (e);
        }
    },



    GetMilestoneDeclineList: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false,
            });

            conditions['$and'] = and_clauses;

            var aggregate = MilestoneInfo.aggregate([
                {
                    $match: { milestone_status: 'Decline', "service_request_id": mongoose.Types.ObjectId(req.query.service_request_id) }
                },
                {
                    $lookup:
                    {
                        from: "milestone_action_reasons",
                        localField: "_id",
                        foreignField: "milestone_id",
                        as: "action_reasons"
                    }
                },
                { $unwind: { path: "$action_reasons", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: "$_id",
                        user_id: "$user_id",
                        service_request_id: "$service_request_id",
                        name: "$name",
                        start_date: "$start_date",
                        end_date: "$end_date",
                        amount: "$amount",
                        created_by: "$created_by",
                        milestone_status: "$milestone_status",
                        payment_status: "$payment_status",
                        is_completed: '$is_completed',
                        milestone_action: [{
                            milestone_modified_by_user_id: "$action_reasons.milestone_modified_by_user_id",
                            action_type: "$action_reasons.action_type",
                            action_reason: "$action_reasons.action_reason"
                        }],
                        status: "$status",
                        isDeleted: "$isDeleted"
                    }
                },

            ]);

            return aggregate;
        } catch (e) {
            return (e);
        }
    },


};

module.exports = MilestoneRepository;