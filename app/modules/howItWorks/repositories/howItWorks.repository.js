const mongoose = require('mongoose');
const HowItWorksModel = require('howItWorks/models/howItWorks.model');
const perPage = config.other.pageLimit;

const howItWorksRepository = {

    getAll: async (req) => {
        try {
            let conditions = {};
            let and_clauses = [];

            and_clauses.push({ "isDeleted": false });

            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'slug': { $regex: req.body.search.value.trim(), $options: 'i' } }
                    ]
                });
            }

            // if (req.body.columns && req.body.columns.length) {
            //     let statusFilter = _.findWhere(req.body.columns, { data: 'status' });
            //     if (statusFilter && statusFilter.search && statusFilter.search.value) {
            //         and_clauses.push({
            //             "status": statusFilter.search.value
            //         });
            //     }
            // }

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

            let aggregate = HowItWorksModel.aggregate([
                { $match: conditions },
                sortOperator
            ],{ collation: { locale: "en",caseFirst:"upper" } });
            let options = { page: req.body.page, limit: req.body.length };
            let allHowItWorks = await HowItWorksModel.aggregatePaginate(aggregate, options);
            
            return allHowItWorks;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        try {
            let datas = await HowItWorksModel.findById(id).lean().exec();
            if (!datas) {
                return null;
            }
            return datas;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        try {
            let datas = await HowItWorksModel.findOne(params).exec();
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    },

    getDistinctDocument: async (field, params) => {
        try {
            let datas = await HowItWorksModel.distinct(field, params);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            let datas = await HowItWorksModel.find(params).exec();
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    },


    getHowItWorksCount: async (params) => {
        try {
            let count = await HowItWorksModel.countDocuments(params);
            if (!count) {
                return null;
            }
            return count;
        } catch (e) {
            return e;
        }

    },

    save: async (data) => {
        try {
            let datas = await HowItWorksModel.create(data);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let datas = await HowItWorksModel.findById(id);
            if (datas) {
                let deleted = await HowItWorksModel.deleteOne({ _id: id }).exec();
                if (!deleted) {
                    return null;
                }
                return deleted;
            }
        } catch (e) {
            throw e;
        }
    },

    updateById: async (data, id) => {
        try {
            let datas = await HowItWorksModel.findByIdAndUpdate(id, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            return e;
        }
    }

};

module.exports = howItWorksRepository;