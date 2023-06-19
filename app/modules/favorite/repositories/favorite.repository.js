const mongoose = require('mongoose');
const Favorite = require('favorite/models/favorite.model');
const perPage = config.other.pageLimit;

const favoriteRepo = {

    getById: async (id) => {
        try {
            let record = await Favorite.findById(id).lean().exec();
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
            let record = await Favorite.findOne(params).exec();
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
            let record = await Favorite.find(params).sort({
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
            let save = await Favorite.create(data);
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
            let recordCount = await Favorite.countDocuments(params);
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
            let record = await Favorite.findById(id);
            if (record) {
                let recordDelete = await Favorite.findByIdAndUpdate(id, {
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
            let record = await Favorite.findByIdAndUpdate(id, data, {
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

    updateMany: async (params, data) => {
        try {
            let updatedData = await Favorite.updateMany(params, { $set: data });
            if (!updatedData) {
                return null;
            }
            return updatedData;
        } catch (err) {
            return err;
        }
    },

    deleteById: async (id) => {
        try {
            let datas = await Favorite.findById(id);
            if (datas) {
                let datasDelete = await Favorite.deleteOne({ _id: id }).exec();
                if (!datasDelete) {
                    return null;
                }
                return datasDelete;
            } else {
                return null;
            }
        } catch (e) {
            throw (e);
        }
    },

    getAllData: async () => {
        let allData = Favorite.aggregate([
            {
                $match: {
                    'isDeleted': false,
                    'status': 'Active'
                }
            }
        ]);
        if (!allData) {
            return null;
        }
        return allData
    },

    getAllFavoriteData: async (param) => {
        try {
            let result = await Favorite.aggregate([
                { $match: param },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userID: '$servicer_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userID']
                                            },
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1,
                                    countryName: 1,
                                    location: 1,
                                    bio: 1,
                                    rate_per_hr: 1,
                                    skills: 1

                                }
                            }
                        ],
                        as: 'user'
                    }

                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        "isFavorite": true,
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            userId: '$user._id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$review_for_user_id', '$$userId']
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    'overallRating': { $round: [{ $avg: ['$workmanship', '$cost', '$schedule', '$communication'] }, 1] },
                                }
                            },
                            {
                                $group: {
                                    _id: '$review_for_user_id',
                                    count: { $sum: 1 },
                                    rating: { $avg: '$overallRating' }
                                }
                            }
                        ],
                        as: 'reviews'
                    }
                },
                { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'skills',
                        let: {
                            skillIds:  '$user.skills'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$skillIds']
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    skills: { $push: '$skill' }
                                }
                            }

                        ],
                        as: 'skills'
                    }

                },
                { $unwind: { path: '$skills', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            userId:  '$servicer_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr:  {
                                        $and: [
                                            {
                                                $eq: ['$proposal_from', '$$userId']

                                            },
                                            {
                                                $eq: ['$proposal_status', 'Accepted']

                                            }
                                        ]
                                    }
                                    
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }

                        ],
                        as: 'proposals'
                    }

                },
                { $unwind: { path: '$proposals', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        servicer_id: '$servicer_id',
                        full_name: '$user.full_name',
                        countryName: '$user.countryName',
                        location: '$user.location',
                        rate_per_hr: '$user.rate_per_hr',
                        bio: '$user.bio',
                        profile_image: '$user.profile_image',
                        skills: '$skills.skills',
                        reviews: '$reviews',
                        isFavorite: "$isFavorite",
                        job_count: '$proposals.count'
                    }
                }
            ])
            if (!result) {
                return null;
            }
            return result;
        } catch (err) {
            throw err;
        }
    },

    getStats: async () => {
        try {
            let count = await Favorite.find({ "isDeleted": false }).count();
            let activecount = await Favorite.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Favorite.find({ "isDeleted": false, "status": "Inactive" }).count();
            return {
                count,
                activecount,
                inactivecount
            };
        } catch (e) {
            return e;
        }
    },

}

module.exports = favoriteRepo;