const mongoose = require('mongoose');
const City = require('city/models/city.model');
const perPage = config.other.pageLimit;

const cityRepo = {

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
                        { 'cityName': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'region.regionName': { $regex: req.body.search.value.trim(), $options: 'i' } },

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

            var aggregate = City.aggregate([
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
                            }
                        ],
                        as: 'region'
                    }
                },
                { $unwind: { path: '$region', preserveNullAndEmptyArrays: false } },
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await City.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await City.findById(id).lean().exec();
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
            let record = await City.findOne(params).exec();
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
            let record = await City.find(params).sort({
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
            let save = await City.create(data);
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
            let recordCount = await City.countDocuments(params);
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
            let record = await City.findById(id);
            if (record) {
                let recordDelete = await City.findByIdAndUpdate(id, {
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
            let record = await City.findByIdAndUpdate(id, data, {
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
            let record = await City.aggregate([
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
            let aggregate = City.aggregate([
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
            // let record = await City.aggregatePaginate(aggregate, options);
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
            let count = await City.find({ "isDeleted": false }).count();
            let activecount = await City.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await City.find({ "isDeleted": false, "status": "Inactive" }).count();

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

module.exports = cityRepo;