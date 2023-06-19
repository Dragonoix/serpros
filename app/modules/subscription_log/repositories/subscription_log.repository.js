const mongoose = require('mongoose');
const SubscriptionLog = require('subscription_log/models/subscription_log.model');
const perPage = config.PAGINATION_PERPAGE;

const SubscriptionLogRepository = {

    getAll: async (req) => {
        
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({ "isDeleted": false });

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'slug': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'content': { $regex: req.body.query.generalSearch, $options: 'i' } }
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({ "status": req.body.query.Status });
            }
            conditions['$and'] = and_clauses;

            var sortOperator = { "$sort": {} };
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

            var aggregate = SubscriptionLog.aggregate([
                { $match: conditions },
                sortOperator
            ]);
            
            var options = { page: req.body.pagination.page, limit: req.body.pagination.perpage };
            let allSubscriptionLog = await SubscriptionLog.aggregatePaginate(aggregate, options);
            
            return allSubscriptionLog;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        let subscription = await SubscriptionLog.findById(id).lean().exec();
        try {
            if (!subscription) {
                return null;
            }
            return subscription;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        let subscription = await SubscriptionLog.findOne(params).exec();
        try {
            if (!subscription) {
                return null;
            }
            return subscription;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        let subscription = await SubscriptionLog.find(params).exec();
        try {
            if (!subscription) {
                return null;
            }
            return subscription;

        } catch (e) {
            return e;
        }
    },

    getSubscriptionLogCount: async (params) => {
        try {
            let subscriptionCount = await SubscriptionLog.countDocuments(params);
            if (!subscriptionCount) {
                return null;
            }
            return subscriptionCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let subscription = await SubscriptionLog.findById(id);
            if (subscription) {
                let subscriptionDelete = await SubscriptionLog.deleteOne({ _id: id }).exec();
                if (!subscriptionDelete) {
                    return null;
                }
                return subscriptionDelete;
            }
        } catch (e) {
            throw e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


    updateById: async (data, id) => {
        try {
            let subscription = await SubscriptionLog.findByIdAndUpdate(id, data, { new: true });
            if (!subscription) {
                return null;
            }
            return subscription;
        } catch (e) {
            return e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    },

    save: async (data) => {
        try {
            let subscription = await SubscriptionLog.create(data);
            if (!subscription) {
                return null;
            }
            return subscription;
        } catch (e) {
            throw e;
        }
    },

    getSubscriptionLogInfo: async (param) => {
        try {

            var conditions = {};
            var and_clauses = [];

            and_clauses.push(param);
            conditions['$and'] = and_clauses;

            var aggregate = await SubscriptionLog.aggregate([
                {
                    $lookup: {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "user_info"
                    }
                },
                {
                    "$unwind": "$user_info"
                },
                {
                    $match: conditions
                },
                {
                    $sort: { updatedAt: -1 }
                }
                // 
            ]);
            return aggregate;
        } catch (e) {
            throw e;
        }
    },

    getAllSubscriptionLogsByParam: async (param) => {
        try {

            var conditions = {};
            var and_clauses = [];

            and_clauses.push(param);
            
            conditions['$and'] = and_clauses;

            var aggregate = await SubscriptionLog.aggregate([
                {
                    $lookup: {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "user_info"
                    }
                },
                {
                    $unwind: "$user_info"
                },
                {
                    $project: {
                        _id: "$_id",
                        "subscription_amount" : "$subscription_amount",
                        "product_id" : "$product_id",
                        "plan_id" : "$plan_id",
                        "customer_id" : "$customer_id",
                        "subscription_id" : "$subscription_id",
                        "period_start" : "$period_start",
                        "period_end" : "$period_end",
                        "status" : "$status",
                        "user_id" : "$user_id",
                        "subscription_plan_id" : "$subscription_plan_id",
                        "current_period_start_date" : "$current_period_start_date",
                        "current_period_end_date" : "$current_period_end_date",
                        "subscription_start_date" : "$subscription_start_date",
                        "user_info": {
                            "_id" : "$user_info._id",
                            "email" : "$user_info.email",
                            "inTrialPeriod" : "$user_info.inTrialPeriod",
                            "isSubscribed" : "$user_info.isSubscribed",
                        }
                    }
                },
                {
                    $match: conditions
                }
            ]);
            return aggregate;
        } catch (e) {
            throw e;
        }
    },

    getSubscriptionLogDetails: async (param) => {
        try {

            var conditions = {};
            var and_clauses = [];

            and_clauses.push(param);
            conditions['$and'] = and_clauses;

            var aggregate = await SubscriptionLog.aggregate([
                
                {
                    $lookup: {
                        "from": "subscription_plans",
                        "localField": "subscription_plan_id",
                        "foreignField": "_id",
                        "as": "subscription_plans"
                    }
                },
                {
                    "$unwind": "$subscription_plans"
                },
                {
                    $match: conditions
                },
                {
                    $project: {
                        "_id": "$_id",
                        "subscription_amount": "$subscription_amount",
                        "plan_name": "$subscription_plans.name",
                        "bill_frequency": "$subscription_plans.bill_frequency",
                        "period_start": "$period_start",
                        "period_end": "$period_end",
                        "current_period_start_date": "$current_period_start_date",
                        "current_period_end_date": "$current_period_end_date",
                        "subscription_start_date": "$subscription_start_date",
                        "subscription_end_date": "$subscription_end_date",
                        "plan_id": "$plan_id",
                        "subscription_id": "$subscription_id",                        
                        "user_id": "$user_id",
                        "subscription_plan_id": "$subscription_plan_id",                        
                        "status": "$status"
                    }
                },
                {
                    $sort: { current_period_start_date: -1 }
                }
            ]);
            return aggregate;
        } catch (e) {
            throw e;
        }
    }

};

module.exports = SubscriptionLogRepository;