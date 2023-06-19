const mongoose = require('mongoose');
const ContactUs = require('contactUs/models/contactUs.model');
const perPage = config.other.pageLimit;

const contactUs = {
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
                        {'firstName': { $regex: req.body.search.value.trim(), $options: 'i'} },         
                        {'email': { $regex: req.body.search.value.trim(), $options: 'i'} },                                                              
                        {'phone': { $regex: req.body.search.value.trim(), $options: 'i'} },                                                              
                        {'message': { $regex: req.body.search.value.trim(), $options: 'i'} },  
                        {'dateString': { $regex: req.body.search.value.trim(), $options: 'i'} },                                                              
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

            var aggregate = ContactUs.aggregate([      
                {
                    $addFields: {
                        dateOfContact: '$createdAt'
                    },
                },
                {

                    $addFields:
                    {
                        dateString: {
                            $dateToString: {
                                date: '$dateOfContact',
                                format: "%m-%d-%Y",
                            }
                        }
                    }
                },               
                {
                    $match: conditions
                },   
                sortOperator
            ]);
            var options = {
                page: req.body.page,
                limit: req.body.length
            };
            let allRecord = await ContactUs.aggregatePaginate(aggregate, options);
            
            return allRecord;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },


    getById: async (id) => {
        try {
            let record = await ContactUs.findById(id).lean().exec();
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
            let record = await ContactUs.findOne(params).exec();
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
            let record = await ContactUs.find(params).sort({
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
            let save = await ContactUs.create(data);
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
            let recordCount = await ContactUs.countDocuments(params);
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
            let record = await ContactUs.findById(id);
            if (record) {
                let recordDelete = await ContactUs.findByIdAndUpdate(id, {
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
            let record = await ContactUs.findByIdAndUpdate(id, data, {
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
            let updatedData = await ContactUs.updateMany(params, { $set: data });
            if (!updatedData) {
                return null;
            }
            return updatedData;
        } catch (err) {
            return err;
        }
    },
    getAllData: async () => {
        let allData = ContactUs.aggregate([
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

    getByParamsCustom: async(param) => {
        try {
            let result = await ContactUs.aggregate([
                {$match: param},
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0
                    }
                }
            ])
            if(!result) {
                return null;
            }
            return result;
        }catch (err) {
            throw err;
        }
    },

    getStats: async () => {
        try {
            let count = await ContactUs.find({ "isDeleted": false }).count();
            let activecount = await ContactUs.find({ "isDeleted": false, "status": "Active" }).count();
            let inactivecount = await ContactUs.find({ "isDeleted": false, "status": "Inactive" }).count();

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

module.exports = contactUs;