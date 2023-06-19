const mongoose = require('mongoose');
const Invitation = require('invitation/models/invitation.model');
const perPage = config.other.pageLimit;

const invitationRepo = {

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

            var aggregate = Invitation.aggregate([
                {
                    $match: conditions
                },
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await Invitation.aggregatePaginate(aggregate, options);
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await Invitation.findById(id).lean().exec();
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
            let record = await Invitation.findOne(params).exec();
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
            let record = await Invitation.find(params).sort({
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
            let save = await Invitation.create(data);
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
            let recordCount = await Invitation.countDocuments(params);
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
            let record = await Invitation.findById(id);
            if (record) {
                let recordDelete = await Invitation.findByIdAndUpdate(id, {
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
            let record = await Invitation.findByIdAndUpdate(id, data, {
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
            let record = await Invitation.aggregate([
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
            let aggregate = Invitation.aggregate([
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
            // let record = await Invitation.aggregatePaginate(aggregate, options);
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
            let count = await Invitation.find({ "isDeleted": false }).count();
            let activecount = await Invitation.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Invitation.find({ "isDeleted": false, "status": "Inactive" }).count();

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
            let record = await Invitation.aggregate([
                {
                    $match: params
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
                                        $eq: ['$_id', '$$jobId']

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
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$invitation_from'
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
                        as: 'invitedBy'
                    }
                },
                {
                    $unwind: {
                        path: '$invitedBy',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        invitation_from: "$invitation_from",
                        invitation_from_name: "$invitedBy.full_name",
                        invitation_from_profile_image: "$invitedBy.profile_image",
                        job_id: "$job_id",
                        job_title: "$job.title",
                        awarded_on: "$createdAt",

                    }
                }

            ]);

            return record;

        } catch (e) {
            return e;
        }
    },

};

module.exports = invitationRepo;