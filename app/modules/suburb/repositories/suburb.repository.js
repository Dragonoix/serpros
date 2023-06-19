const mongoose = require('mongoose');
const Suburb = require('suburb/models/suburb.model');
const perPage = config.other.pageLimit;

const suburbRepo = {

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
                        { 'suburbName': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'region.regionName': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'city.cityName': { $regex: req.body.search.value.trim(), $options: 'i' } },


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

            var aggregate = Suburb.aggregate([
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
                { $unwind: { path: '$region', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'cities',
                        let: {
                            cityId: '$city'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$cityId']
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
                        as: 'city'
                    }
                },
                { $unwind: { path: '$city', preserveNullAndEmptyArrays: false } },
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await Suburb.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await Suburb.findById(id).lean().exec();
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
            let record = await Suburb.findOne(params).exec();
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
            let record = await Suburb.find(params).sort({
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
            let save = await Suburb.create(data);
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
            let recordCount = await Suburb.countDocuments(params);
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
            let record = await Suburb.findById(id);
            if (record) {
                let recordDelete = await Suburb.findByIdAndUpdate(id, {
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
            let record = await Suburb.findByIdAndUpdate(id, data, {
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
            let record = await Suburb.aggregate([
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
            let aggregate = Suburb.aggregate([
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
            // let record = await Suburb.aggregatePaginate(aggregate, options);
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
            let count = await Suburb.find({ "isDeleted": false }).count();
            let activecount = await Suburb.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Suburb.find({ "isDeleted": false, "status": "Inactive" }).count();

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

module.exports = suburbRepo;