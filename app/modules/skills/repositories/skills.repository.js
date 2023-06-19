const mongoose = require('mongoose');
const SkillManagement = require('skills/models/skills.model');
const perPage = config.other.pageLimit;

const SkillManagementRepo = {

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
                        { 'skill': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'category_detail.categoryName': { $regex: req.body.search.value.trim(), $options: 'i' } }
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

            var aggregate = SkillManagement.aggregate([
                
                {
                    $lookup: {
                        from: 'categorymanagements',
                        let: {
                            catId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$catId']
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
                            },
                            {
                                $project: {
                                    categoryName: 1
                                }
                            }
                        ],
                        as: 'category_detail'
                    }
                },
                { $unwind: { path: '$category_detail', preserveNullAndEmptyArrays: false } },
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await SkillManagement.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await SkillManagement.findById(id).lean().exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        try {
            let record = await SkillManagement.findOne(params).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {
        try {
            let record = await SkillManagement.find(params).sort({
                'title': 1
            }).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },



    save: async (data) => {
        try {
            let save = await SkillManagement.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            throw e;
        }
    },

    getDocumentCount: async (params) => {
        try {
            let recordCount = await SkillManagement.countDocuments(params);
            if (!recordCount) {
                return null;
            }
            return recordCount;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let record = await SkillManagement.findById(id);
            if (record) {
                let recordDelete = await SkillManagement.findByIdAndUpdate(id, {
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
            let record = await SkillManagement.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    },

    getByParamsCustom: async (params) => {
        try {
            let record = await SkillManagement.aggregate([
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
            let aggregate = SkillManagement.aggregate([
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
            // let record = await SkillManagement.aggregatePaginate(aggregate, options);
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
            let count = await SkillManagement.find({ "isDeleted": false, "skillType": 'Service' }).count();
            let activecount = await SkillManagement.find({ "isDeleted": false, "status": "Active", "skillType": 'Service'  }).count();
            let inactivecount = await SkillManagement.find({ "isDeleted": false, "status": "Inactive", "skillType": 'Service' }).count();

            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            throw e;
        }
    },

};

module.exports = SkillManagementRepo;