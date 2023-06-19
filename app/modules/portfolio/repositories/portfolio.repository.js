const mongoose = require('mongoose');
const PortfolioModel = require('portfolio/models/portfolio.model');
const perPage = config.other.pageLimit;

const cmsRepository = {

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

            let aggregate = PortfolioModel.aggregate([
                { $match: conditions },
                sortOperator
            ]);
            let options = { page: req.body.page, limit: req.body.length };
            let allCms = await PortfolioModel.aggregatePaginate(aggregate, options);

            return allCms;
        } catch (e) {
            throw (e);
        }
    },

    getById: async (id) => {
        try {
            let datas = await PortfolioModel.findById(id).lean().exec();
            if (!datas) {
                return null;
            }
            return datas;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        try {
            let datas = await PortfolioModel.findOne(params).exec();
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    getDistinctDocument: async (field, params) => {
        try {
            let datas = await PortfolioModel.distinct(field, params);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        try {
            let datas = await PortfolioModel.find(params).exec();
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    getImageCount: async (params) => {
        try {
            let count = await PortfolioModel.countDocuments(params);
            if (!count) {
                return null;
            }
            return count;
        } catch (e) {
            throw e;
        }
    },

    save: async (data) => {
        try {
            let datas = await PortfolioModel.create(data);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let datas = await PortfolioModel.findById(id);
            if (datas) {
                let deleted = await PortfolioModel.deleteOne({ _id: id }).exec();
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
            let datas = await PortfolioModel.findByIdAndUpdate(id, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },


    getPostsByUser: async (id) => {
        try {
            let record = await PortfolioModel.aggregate([
                {
                    $match: {
                        user_id: id, isDeleted: false 
                    }
                },
                {
                    $project: {
                        isDeleted: 0,
                        updatedAt: 0,
                        mime_type: 0
                    }
                }
            ]);
            if (_.isEmpty(record)) {
                return null;
            }
            return record;
        } catch (err) {
            throw err
        }
    }, 



};

module.exports = cmsRepository;