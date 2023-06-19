const mongoose = require('mongoose');
const User = require('user/models/user.model');
const perPage = config.other.pageLimit;

const userRepository = {
    fineOneWithRole: async (params) => {
        try {
            let user = await User.findOne({
                email: params.email,
                role: { $in: params.roles },
                isDeleted: false,
                status: "Active"
            }).populate('role').exec();

            if (!user) {
                return {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. User not found.'
                }
            }

            if (!user.validPassword(params.password, user.password)) {
                return {
                    "status": 500,
                    data: null,
                    "message": 'Authentication failed. Wrong password.'
                }
            } else {
                return {
                    "status": 200,
                    data: user,
                    "message": ""
                }
            }
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    },


    getAllUsers: async (req) => {
        try {
            let conditions = {};
            let and_clauses = [];

            and_clauses.push({ "isDeleted": false });
            and_clauses.push({ "user_role.role": req.body.role });

            if (_.isObject(req.body.search) && _.has(req.body.search, 'value')) {
                and_clauses.push({
                    $or: [
                        { 'full_name': { $regex: req.body.search.value.trim(), $options: 'i' } },
                        { 'email': { $regex: '^' + req.body.search.value.trim(), $options: 'i' } },
                    ]
                });
            }

            if (req.body.columns && req.body.columns.length) {
                let statusFilter = _.findWhere(req.body.columns, { data: 'status' });
                if (statusFilter && statusFilter.search && statusFilter.search.value) {
                    and_clauses.push({
                        "status": statusFilter.search.value
                    });
                }
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

            let aggregate = User.aggregate([
                {
                    $lookup: {
                        "from": "roles",
                        "let": { role: "$role" },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] },
                                            { $eq: ["$isDeleted", false] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName"
                                }
                            }
                        ],
                        "as": "user_role"
                    }
                },
                { "$unwind": "$user_role" },
                {
                    $group: {
                        '_id': '$_id',
                        'full_name': { $first: '$full_name' },
                        'email': { $first: '$email' },
                        'isDeleted': { $first: '$isDeleted' },
                        'status': { $first: '$status' },
                        'user_role': { $first: '$user_role' },
                        'user_type': { $first: '$user_type' },
                        'profile_image': { $first: '$profile_image' },
                        'createdAt': { $first: '$createdAt' }
                    }
                },
                { $match: conditions },
                sortOperator
            ]);

            let options = { page: req.body.page, limit: req.body.length };
            let allUsers = await User.aggregatePaginate(aggregate, options);
            return allUsers;
        } catch (e) {
            console.log(e);
            throw (e);
        }
    },

    getAllUsersByFields: async (params) => {
        try {
            return await User.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        first_name: 1,
                        last_name: 1,
                        full_name: 1,
                        email: 1,
                        status: 1,
                        isDeleted: 1
                    }
                },
                { $match: params }
            ]);
        } catch (e) {
            throw e;
        }
    },

    getUserDetails: async (params) => {
        try {
            let aggregate = await User.aggregate([
                { $match: params },
                {
                    $lookup: {
                        "from": "roles",
                        let: { role: "$role" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$role"] }
                                        ]
                                    }
                                }
                            },

                            {
                                $project: {
                                    _id: "$_id",
                                    role: "$role",
                                    roleDisplayName: "$roleDisplayName"
                                }
                            }
                        ],
                        "as": "role"
                    }
                },
                { "$unwind": "$role" },
                {
                    $project: {
                        password: 0,
                        deviceToken: 0,
                        deviceType: 0,
                        register_type: 0,
                        isDeleted: 0,
                        status: 0,
                        updatedAt: 0,
                    }
                },
            ]);
            if (!aggregate) return null;
            return aggregate;
        } catch (e) {
            throw e;
        }
    },

    getById: async (id) => {
        try {
            let user = await User.findById(id).populate('role').exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getByIdWithUserDevices: async (id) => {
        try {
            let user = await User.findById(id).populate('role').populate({
                path: 'userdevices',
                options: { sort: { updatedAt: -1 } }
            }).exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getByIdWithParam: async (id) => {
        try {
            let user = await User.findById(id).populate('role').populate({
                path: 'userdevices',
                options: { sort: { updatedAt: -1 } }
            }).exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {
        try {
            let user = await User.findOne(params).populate('role').exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getAllSelectedFields: async (params) => {
        try {
            let user = await User.find(params, { email: 1, first_name: 1, last_name: 1, full_name: 1, _id: 1 }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    getDistinctDocument: async (field, params) => {
        try {
            let record = await User.distinct(field, params);
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

    getUserCountByParam: async (params) => {
        try {
            let user = await User.countDocuments(params);
            return user;
        } catch (e) {
            throw (e);
        }
    },

    getDistinctDocumentCount: async (field, params) => {
        try {
            let recordCount = await User.distinct(field, params);
            if (!recordCount) {
                return 0;
            }
            return recordCount.length;
        } catch (e) {
            throw e;
        }
    },


    getAllByField: async (params) => {
        try {
            let user = await User.find(params).populate('role').lean().exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },


    getLimitUserByField: async (params, limit) => {
        try {
            let user = await User.find(params).populate('role').limit(limit).sort({
                _id: -1
            }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let user = await User.findById(id);
            if (user) {
                let userDelete = await User.deleteOne({ _id: id }).exec();
                if (!userDelete) {
                    return null;
                } else {
                    await PrivacySettingsModel.deleteMany({ user_id: mongoose.Types.ObjectId(id) });
                    return userDelete;
                }
            } else {
                return null;
            }
        } catch (e) {
            throw e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


    updateById: async (data, id) => {
        try {
            let user = await User.findByIdAndUpdate(id, data, {
                new: true
            });

            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },


    updateByField: async (data, param) => {
        try {
            let user = await User.updateOne(param, data, {
                new: true
            });
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    updateAllByParams: async (data, params) => {
        try {
            let datas = await User.updateMany(params, data, { new: true });
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
            let user = await User.create(data);

            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    forgotPassword: async (params) => {
        try {
            let user = await User.findOne({ email: params.email.trim(), isDeleted: false }).exec();
            if (!user) {
                throw { "status": 500, data: null, "message": 'Authentication failed. User not found.' }
            } else if (user) {
                let random_pass = Math.random().toString(36).substr(2, 9);
                let readable_pass = random_pass;
                random_pass = user.generateHash(random_pass);
                let user_details = await User.findByIdAndUpdate(user._id, { password: random_pass }).exec();
                if (!user_details) {
                    throw { "status": 500, data: null, "message": 'User not found.' }
                } else {
                    throw { "status": 200, data: readable_pass, "message": "Mail is sending to your mail id with new password" }
                }
                //return readable_pass;	
            }
        } catch (e) {
            throw e;
        }
    },

    getUser: async (id) => {
        try {
            let user = await User.findOne({
                _id: id
            }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    getUserByField: async (data) => {
        try {
            let user = await User.findOne(data).populate('role').exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    getUsersByField: async (data) => {
        try {
            let user = await User.find(data).populate('role').exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },

    findAllUsers: async () => {
        try {
            let data = await User.find({ "isDeleted": false });
            if (_.isEmpty(data)) {
                return null;
            }
            return data;
        } catch (err) {
            throw err;
        }
    },

    getByIdWithPopulate: async (id) => {
        try {
            let user = await User.findById(id).populate('role').lean().exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },

    getByParam: async (params) => {
        try {
            let record = await User.aggregate([
                {
                    $match: {
                        $and: [params]
                    }
                },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        creditScores: 0,
                        stripeCustomerId: 0,
                        registerType: 0,
                        socialId: 0,
                        deviceToken: 0,
                        deviceType: 0,
                        isDeleted: 0,
                        isActive: 0,
                        status: 0,
                        subscription: 0,
                        promoCode: 0,
                        referralCode: 0,
                        isSubscribed: 0,
                        role: 0,
                        phone: 0,
                        email: 0,
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

    getAllServicer: async (req) => {
        try {

            // console.log('Hello repository');
            let geoCondition = {
                $match: {
                    isDeleted: false
                }
            }

            let condition = {
                isDeleted: false,
                status: "Active",
                user_type: "service_provider"
            }

            let condition2 = {};
            let sortCond = { 'createdAt': -1 };

            if (req.body.catId != null && req.body.catId != undefined && req.body.catId != "" && (req.body.catId).constructor === Array) {
                condition['category'] = { $in: req.body.catId.map(s => mongoose.Types.ObjectId(s)) }
            }
            if (req.body.city != null && req.body.city != undefined && req.body.city != "" && (req.body.city).constructor === Array) {
                condition2['cityName'] = { $in: req.body.city }
            }

            if (req.body.full_name && req.body.full_name != null && req.body.full_name != undefined && req.body.full_name != "") {
                condition2['full_name'] = { $regex: req.body.full_name.trim(), $options: 'i' }
            }

            if (req.body.location && req.body.location != null && req.body.location != undefined && req.body.location != "") {
                geoCondition = {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [
                                req.body.location.lat,
                                req.body.location.lng
                            ]
                        },
                        distanceField: "dist.calculated",
                        maxDistance: 10,
                        spherical: true
                    }
                }

            }

            if (req.body.rating && req.body.rating != null && req.body.rating != undefined && req.body.rating != "") {
                if (req.body.rating.toString() == "4") {
                    condition2['rating.rating'] = { $gte: 4 }
                }
                if (req.body.rating.toString() == "3") {
                    condition2['rating.rating'] = { $gte: 3 }
                }
            }

            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                if (req.body.price.gt != null && req.body.price.lt != null) {
                    condition2['rate_per_hr'] = { $gte: parseInt(req.body.price.gt), $lte: parseInt(req.body.price.lt) }
                } else if (req.body.price.gt != null && req.body.price.lt == null) {
                    condition2['rate_per_hr'] = { $gte: parseInt(req.body.price.gt) }
                } else if (req.body.price.gt == null && req.body.price.lt != null) {
                    condition2['rate_per_hr'] = { $lte: parseInt(req.body.price.gt) }
                } else {
                    console.log("Invalid price params");
                }
            }

            if (req.body.sort && req.body.sort != null && req.body.sort != undefined && req.body.sort != "") {
                if (req.body.sort == "asc") {
                    sortCond = { 'rating.rating': 1 }
                } else if (req.body.rating == "desc") {
                    sortCond = { 'rating.rating': -1 }
                } else {
                    sortCond = { 'createdAt': -1 };
                }
            }

            let data = await User.aggregate([
                geoCondition,
                {
                    $match: condition
                },                
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            userId: '$_id'
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
                            skillIds: { $cond: { if: '$skills', then: '$skills', else: [] } }
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
                        from: 'favorites',
                        let: {
                            servicer_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [                                           
                                            { $eq: ['$servicer_id', '$$servicer_id'] }
                                        ]

                                    }
                                }
                            }

                        ],
                        as: 'favorite'
                    }
                },
                { $unwind: { path: '$favorite', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        "invitation_data.invitation_to": { $ifNull: ["$invitation_data.invitation_to", ""] }
                    }
                },
                {
                    $project: {
                        full_name: '$full_name',
                        profile_image: '$profile_image',
                        countryName: '$countryName',
                        cityName: '$cityName',
                        bio: '$bio',
                        geo_loc: '$geo_loc',
                        location: '$location',
                        rate_per_hr: '$rate_per_hr',
                        skills: { $cond: { if: '$skills', then: '$skills.skills', else: [] } },
                        rating: {
                            rating_count: { $cond: { if: '$reviews.count', then: '$reviews.count', else: 0 } },
                            rating: { $cond: { if: '$reviews.rating', then: { $round: ['$reviews.rating', 1] }, else: 0 } },
                        },
                        is_fav: { $cond: { if: '$favorite', then: true, else: false } },
                        createdAt: '$createdAt',
                        // "invitation_data.invitation_to": "$invitation_data.invitation_to",
                        is_invited: { $cond: [{ $eq: ['$invitation_data.invitation_to', '$_id'] }, true, false] },
                    }
                },
                {
                    $match: condition2
                },
                { $sort: sortCond }
            ]);

            return data;

        } catch (e) {
            throw e;
        }
    }, 

    getAllServicerByCategory: async (req) => {
        try {

            let geoCondition = {
                $match: {
                    isDeleted: false
                }
            }

            let condition = {
                isDeleted: false,
                status: "Active",
                user_type: "service_provider"
            }

            let condition2 = {};
            let sortCond = { 'createdAt': -1 };

            if (req.body.catId != null && req.body.catId != undefined && req.body.catId != "" && (req.body.catId).constructor === Array) {
                condition['category'] = { $in: req.body.catId.map(s => mongoose.Types.ObjectId(s)) }
            }
            if (req.body.city != null && req.body.city != undefined && req.body.city != "" && (req.body.city).constructor === Array) {
                condition2['cityName'] = { $in: req.body.city }
            }

            if (req.body.full_name && req.body.full_name != null && req.body.full_name != undefined && req.body.full_name != "") {
                condition2['full_name'] = { $regex: req.body.full_name.trim(), $options: 'i' }
            }

            if (req.body.location && req.body.location != null && req.body.location != undefined && req.body.location != "") {
                geoCondition = {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [
                                req.body.location.lat,
                                req.body.location.lng
                            ]
                        },
                        distanceField: "dist.calculated",
                        maxDistance: 10,
                        spherical: true
                    }
                }

            }

            if (req.body.rating && req.body.rating != null && req.body.rating != undefined && req.body.rating != "") {
                if (req.body.rating.toString() == "4") {
                    condition2['rating.rating'] = { $gte: 4 }
                }
                if (req.body.rating.toString() == "3") {
                    condition2['rating.rating'] = { $gte: 3 }
                }
            }

            if (req.body.price && req.body.price != null && req.body.price != undefined && req.body.price != "") {
                if (req.body.price.gt != null && req.body.price.lt != null) {
                    condition2['rate_per_hr'] = { $gte: parseInt(req.body.price.gt), $lte: parseInt(req.body.price.lt) }
                } else if (req.body.price.gt != null && req.body.price.lt == null) {
                    condition2['rate_per_hr'] = { $gte: parseInt(req.body.price.gt) }
                } else if (req.body.price.gt == null && req.body.price.lt != null) {
                    condition2['rate_per_hr'] = { $lte: parseInt(req.body.price.gt) }
                } else {
                    console.log("Invalid price params");
                }
            }

            if (req.body.sort && req.body.sort != null && req.body.sort != undefined && req.body.sort != "") {
                if (req.body.sort == "asc") {
                    sortCond = { 'rating.rating': 1 }
                } else if (req.body.rating == "desc") {
                    sortCond = { 'rating.rating': -1 }
                } else {
                    sortCond = { 'createdAt': -1 };
                }
            }

            let data = await User.aggregate([
                geoCondition,
                {
                    $match: condition
                },
                {
                    $lookup: {
                        from: 'invitations',
                        let: {
                            user_id: req.user._id, jobId: mongoose.Types.ObjectId(req.body.job_id), servicer_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$invitation_from', '$$user_id'] },
                                            { $eq: ['$job_id', '$$jobId'] },
                                            { $eq: ['$invitation_to', "$$servicer_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'invitation_data'
                    }
                },
                { $unwind: { path: '$invitation_data', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            userId: '$_id'
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
                            skillIds: { $cond: { if: '$skills', then: '$skills', else: [] } }
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
                        from: 'favorites',
                        let: {
                            user_id: req.user._id, servicer_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$user_id', '$$user_id'] },
                                            { $eq: ['$servicer_id', '$$servicer_id'] }
                                        ]

                                    }
                                }
                            }

                        ],
                        as: 'favorite'
                    }
                },
                { $unwind: { path: '$favorite', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        "invitation_data.invitation_to": { $ifNull: ["$invitation_data.invitation_to", ""] }
                    }
                },
                {
                    $project: {
                        full_name: '$full_name',
                        profile_image: '$profile_image',
                        countryName: '$countryName',
                        cityName: '$cityName',
                        bio: '$bio',
                        geo_loc: '$geo_loc',
                        location: '$location',
                        rate_per_hr: '$rate_per_hr',
                        skills: { $cond: { if: '$skills', then: '$skills.skills', else: [] } },
                        rating: {
                            rating_count: { $cond: { if: '$reviews.count', then: '$reviews.count', else: 0 } },
                            rating: { $cond: { if: '$reviews.rating', then: { $round: ['$reviews.rating', 1] }, else: 0 } },
                        },
                        is_fav: { $cond: { if: '$favorite', then: true, else: false } },
                        createdAt: '$createdAt',
                        // "invitation_data.invitation_to": "$invitation_data.invitation_to",
                        is_invited: { $cond: [{ $eq: ['$invitation_data.invitation_to', '$_id'] }, true, false] },
                    }
                },
                {
                    $match: condition2
                },
                { $sort: sortCond }
            ]);

            return data;

        } catch (e) {
            throw e;
        }
    },



    getPortfolio: async (id) => {
        try {
            let aggregate = await User.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: 'Active',
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'skills',
                        let: {
                            skillids: '$skills'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$skillids']
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    skill: { $push: '$skill' }
                                }
                            }
                        ],
                        as: 'skills'
                    }
                },
                {
                    $unwind: {
                        path: '$skills',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { userID: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$review_for_user_id', '$$userID']
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    overall_average: {$avg: '$average'},
                                    review_count: { $sum: 1 }
                                }
                            }
                            
                                                    
                        ],
                        as: 'review'
                    }
                },
                {
                    $unwind: {
                        path: '$review',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            user_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and:
                                            [
                                                { $eq: ['$proposal_from', '$$user_id'] },
                                                { $eq: ["$proposal_status", "Accepted"] }
                                            ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'jobs',
                                    let: {
                                        job_id: '$job_id'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and:
                                                        [
                                                            { $eq: ['$_id', '$$job_id'] },
                                                            { $eq: ['$is_completed', true] }
                                                        ]
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
                                $group: {
                                    _id: null,
                                    project_count: { $sum: 1 },
                                    jobs: { $push: '$job' },
                                }
                            },
                            {
                                $project: {
                                    project_count: '$project_count',
                                    completed_project_count: {
                                        $size: '$jobs'
                                    }
                                }
                            }
                        ],
                        as: 'proposals'
                    }
                },
                {
                    $unwind: {
                        path: '$proposals',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'portfolios',
                        let: {
                            portfolio_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$user_id', '$$portfolio_id']
                                    }
                                }
                            },
                            {
                                $project: {
                                    files: '$files',
                                    text: '$text'
                                }
                            }
                        ],
                        as: 'portfolios'
                    }
                },                
                {
                    $project: {
                        full_name: '$full_name',
                        profile_image: '$profile_image',
                        bio: '$bio',
                        job_title: '$job_title',
                        rate_per_hr: '$rate_per_hr',
                        cityName: '$cityName',
                        stateName: '$stateName',
                        countryName: '$countryName',
                        // phone: '$phone',
                        // email: '$email',
                        skills: '$skills.skill',
                        project_count: '$proposals.project_count',
                        completed_project_count: '$proposals.completed_project_count',
                        portfolios: '$portfolios',
                        overall_average: { $cond: { if: '$review.overall_average', then: {$round: ['$review.overall_average', 1]}, else: 0 } },
                        review_count: { $cond: { if: '$review.review_count', then: '$review.review_count', else: 0 } }
                    }
                },

            ]);

            if (!aggregate) {
                return null;
            }

            return aggregate[0];

        } catch (err) {
            throw err
        }
    },


    getSettingData: async (id) => {
        try {
            let user = await User.aggregate([
                {
                    $match: {
                        _id: id,
                    }
                },
                {
                    $project: {
                        availabilities: {
                            "monday": '$availabilities.monday',
                            "tuesday": '$availabilities.tuesday',
                            "wednesday": '$availabilities.wednesday',
                            "thursday": '$availabilities.thursday',
                            "friday": '$availabilities.friday',
                            "saturday": '$availabilities.saturday',
                            "sunday": '$availabilities.sunday'
                        }, 
                        email: '$email', 
                        password: '$password', 
                        location: '$location', 
                        status: '$status', 
                        personal_url: '$personal_url',
                        notification_settings: {
                            transactional_email_preference: '$transactional_email_preference',
                            project_notification_preference: '$project_notification_preference',
                            marketing_email_preference: '$marketing_email_preference'
                        },
                        enable_sms_update: { $cond: { if: '$enable_sms_update', then: '$enable_sms_update', else: false } },
                        sound_alerts: { $cond: { if: '$sound_alerts', then: '$sound_alerts', else: false } },
                        billing_info: '$billing_info',
                        default_currency: '$default_currency'
                    }
                }
            ])
            
            if (user.length > 0) {
                return user[0];
            } else {
                return null;
            }
            

        } catch (e) {
            throw e;
        }
    },


};

module.exports = userRepository;