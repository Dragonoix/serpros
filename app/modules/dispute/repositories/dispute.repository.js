const mongoose = require('mongoose');
const Dispute = require('dispute/models/dispute.model');
const perPage = config.other.pageLimit;

const disputeRepo = {

    getById: async (id) => {
        try {
            let record = await Dispute.findById(id).lean().exec();
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
            let record = await Dispute.findOne(params).exec();
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
            let record = await Dispute.find(params).sort({
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
            let save = await Dispute.create(data);
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
            let recordCount = await Dispute.countDocuments(params);
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
            let record = await Dispute.findById(id);
            if (record) {
                let recordDelete = await Dispute.findByIdAndUpdate(id, {
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
            let record = await Dispute.findByIdAndUpdate(id, data, {
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
            let updatedData = await Dispute.updateMany(params, { $set: data });
            if (!updatedData) {
                return null;
            }
            return updatedData;
        } catch (err) {
            return err;
        }
    },
    getAllData: async () => {
        let allData = Dispute.aggregate([
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

    getByParamsCustom: async (param) => {
        try {
            let result = await Dispute.aggregate([
                { $match: param },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0
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
            let count = await Dispute.find({ "isDeleted": false }).count();
            let activecount = await Dispute.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await Dispute.find({ "isDeleted": false, "status": "Inactive" }).count();
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

module.exports = disputeRepo;