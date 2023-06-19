const mongoose = require('mongoose');
const BidInfo = require("bid_management/models/bid.model");
const perPage = config.PAGINATION_PERPAGE;


const BidRepository = {

    getById: async (id) => {
        try {
            let record = await BidInfo.findById(id).lean().exec();
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

    getCount: async (params) => {
        try {
            let recordCount = await BidInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {
        let record = await BidInfo.findOne(params).exec();
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        let record = await BidInfo.find(params).exec();
        try {
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
            let save = await BidInfo.create(data);
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
            let recordCount = await BidInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            return e;
        }
    },

    delete: async (id) => {
        try {
            let record = await BidInfo.findById(id);
            if (record) {
                let recordDelete = await BidInfo.findByIdAndUpdate(id, {
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

    updateById: async (id, data) => {
        try {
            let record = await BidInfo.findByIdAndUpdate(id, data, {
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
  

    updateBidStatus: async (params, data) => {
        try {
            let record = await BidInfo.updateMany(params, data, {
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
    getAllWithBidderDetails: async (req) => {

        try {
            let record = await BidInfo.aggregate([
                {
                    $match: {
                        service_request_id: mongoose.Types.ObjectId(req.query.service_request_id),
                        isDeleted: false
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "bidder_id",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: "$_id",
                        service_request_id: "$service_request_id",
                        bidder_id: "$bidder_id",
                        bidder_name: "$userData.full_name",
                        bidder_pic: "$userData.profile_pic",
                        bid_file: "$bid_file",
                        description: "$description",
                        price_quote: "$price_quote",
                        estimated_start_date: "$estimated_start_date",
                        estimated_end_date: "$estimated_end_date",
                        status: "$status",
                        status_reason: "$status_reason",
                        isDeleted: "$isDeleted",
                    }
                }
            ]);
            return record;

        } catch (e) {
            return e;
        }
    },


}

module.exports = BidRepository;