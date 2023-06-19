const mongoose = require('mongoose');
const NotificationInfo = require('notification/models/notification.model');

const perPage = config.PAGINATION_PERPAGE;

const NotificationRepository = {

    // getAll: async (req) => {
    //     try {
    //         var conditions = {};
    //         var and_clauses = [];
    //         and_clauses.push({
    //             "isDeleted": false
    //         });


    //         conditions['$and'] = and_clauses;

    //         var sortOperator = {
    //             "$sort": {}
    //         };
    //         if (_.has(req.body, 'sort')) {
    //             var sortField = req.body.sort.field;
    //             if (req.body.sort.sort == 'desc') {
    //                 var sortOrder = -1;
    //             } else if (req.body.sort.sort == 'asc') {
    //                 var sortOrder = 1;
    //             }

    //             sortOperator["$sort"][sortField] = sortOrder;
    //         } else {
    //             sortOperator["$sort"]['_id'] = -1;
    //         }

    //         var aggregate = NotificationInfo.aggregate([

    //             {
    //                 $match: conditions
    //             },
    //             sortOperator
    //         ]);

    //         var options = {
    //             page: req.body.pagination.page,
    //             limit: req.body.pagination.perpage
    //         };
    //         let allRecord = await NotificationInfo.aggregatePaginate(aggregate, options);

    //         return allRecord;
    //     } catch (e) {
    //         return (e);
    //     }
    // },


    getById: async (id) => {

        try {
            let record = await NotificationInfo.findById(id).lean().exec();

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
            let record = await NotificationInfo.findOne(params).exec();

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
            let record = await NotificationInfo.find(params).exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    unseenCount: async (params) => {
        try {
            let record = await NotificationInfo.find(params).count();
            if (!record) {
                return 0;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAll: async (params) => {
        try {
            let record = await NotificationInfo.aggregate([
                {
                    $match: params
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userid: '$from_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$userid']

                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1
                                }
                            }

                        ],
                        as: 'from_user'
                    }
                },
                {
                    $unwind: {
                        path: '$from_user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);

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
            let save = await NotificationInfo.create(data);
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
            let record = await NotificationInfo.findById(id);
            if (record) {
                let recordDelete = await NotificationInfo.findByIdAndUpdate(id, {
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
            let record = await NotificationInfo.findByIdAndUpdate(id, data, {
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
            let record = await NotificationInfo.updateMany(params, data);
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
            let record = await NotificationInfo.update(params, data, {
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

    updateByFieldMany: async (params, data) => {
        try {
            let record = await NotificationInfo.updateMany(params, data, {
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
            let recordCount = await NotificationInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },


    getAllActivity: async (params) => {
        try {
            let record = await NotificationInfo.aggregate([
                {
                    $match: params
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userid: '$from_user_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userid']
                                            }
                                            
                                        ]
                                        

                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1
                                }
                            }

                        ],
                        as: 'from_user'
                    }
                },
                {
                    $unwind: {
                        path: '$from_user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        activity_against: '$notification_against',
                        activity : '$notification_message',
                        type: '$type',
                        createdAt: '$createdAt',
                        isDeleted: '$isDeleted',
                        from_user: '$from_user'
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ]);

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },


};

module.exports = NotificationRepository;