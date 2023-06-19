const mongoose = require('mongoose');
const FaqManagement = require('faqManagement/models/faqManagement.model');
const perPage = config.other.pageLimit;

const CategoryManagementRepo = {

    getAll: async (req) => {

        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false
            });
            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'question': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'answer': { $regex: req.body.search.value.trim(), $options: 'i' } },


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

            var aggregate = FaqManagement.aggregate([
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await FaqManagement.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await FaqManagement.findById(id).lean().exec();
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
            let record = await FaqManagement.findOne(params).exec();
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
            let record = await FaqManagement.find(params).sort({
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
            let save = await FaqManagement.create(data);
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
            let recordCount = await FaqManagement.countDocuments(params);
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
            let record = await FaqManagement.findById(id);
            if (record) {
                let recordDelete = await FaqManagement.findByIdAndUpdate(id, {
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
            let record = await FaqManagement.findByIdAndUpdate(id, data, {
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
            let record = await FaqManagement.aggregate([
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
            let aggregate = FaqManagement.aggregate([
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
            // let record = await FaqManagement.aggregatePaginate(aggregate, options);
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
            let count = await FaqManagement.find({ "isDeleted": false }).count();
            let activecount = await FaqManagement.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await FaqManagement.find({ "isDeleted": false, "status": "Inactive" }).count();

            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            return e;
        }
    },

};

module.exports = CategoryManagementRepo;