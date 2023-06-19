const mongoose = require('mongoose');
const ActivitiesModel = require('userActivityTimelines/models/userActivityTimelines.model');

const userActivityTimelinesRepository = {
    getById: async (id) => {
        try {
            let datas = await ActivitiesModel.findById(id).exec();
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    getByField: async (params) => {
        try {
            let datas = await ActivitiesModel.findOne(params).lean().exec();
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    getAllByField: async (params) => {
        try {
            let datas = await ActivitiesModel.find(params).exec();
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    getAllByFieldWithSortAndLimit: async (params, sort, limit) => {
        try {
            let datas = await ActivitiesModel.find(params).sort(sort).limit(limit).exec();
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    getDistinctDocument: async (field, params) => {
        try {
            let datas = await ActivitiesModel.distinct(field, params);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    getCountByParam: async (params) => {
        try {
            let datas = await ActivitiesModel.countDocuments(params);
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    getDistinctDocumentCount: async (field, params) => {
        try {
            let datasCount = await ActivitiesModel.distinct(field, params);
            if (!datasCount) {
                return 0;
            }
            return datasCount.length;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let datas = await ActivitiesModel.findById(id);
            if (datas) {
                let dataDelete = await ActivitiesModel.deleteOne({_id: id}).exec();
                return dataDelete;
            } else {
                return null;
            }
        } catch (e) {
            throw (e);
        }
    },

    bulkDelete: async (params) => {
        try {
            await ActivitiesModel.deleteMany(params);
            return true;
        } catch (e) {
            throw e;
        }
    },

    updateById: async (data, id) => {
        try {
            let datas = await ActivitiesModel.findByIdAndUpdate(id, data, {
                new: true,
                upsert: true
            }).exec();
            return datas;
        } catch (e) {
            throw (e);
        }
    },

    updateByField: async (data, param) => {
        try {
            let datas = await ActivitiesModel.updateOne(param, data, {
                new: true
            });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    updateAllByParams: async (data, params) => {
        try {
            let datas = await ActivitiesModel.updateMany(params, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    save: async (data) => {
        try {
            let datas = await ActivitiesModel.create(data);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    }
};

module.exports = userActivityTimelinesRepository;