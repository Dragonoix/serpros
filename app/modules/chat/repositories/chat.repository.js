const mongoose = require('mongoose');
const Chat = require("chat/models/chat.model");
const ChatRoom = require("chat/models/chatRoom.model");
const { replace } = require('lodash');
const perPage = config.PAGINATION_PERPAGE;
var ObjectId = require('mongoose').Types.ObjectId;



const chatRepository = {

    createRoom: async (data) => {
        try {
            let save = await ChatRoom.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            return e;
        }
    },

    getChatWithList: async (req) => {

        var conditions = {};
        var and_clauses = [];
        and_clauses.push({
            "isDeleted": false,
        });
        if (_.has(req.body, 'search') && req.body.search != "") {
            and_clauses.push({
                $or: [
                    { 'name': { $regex: req.body.search.trim(), $options: 'i' } },

                ]
            });

        }
        conditions['$and'] = and_clauses;

        let record = await ChatRoom.aggregate([
            {
                $match: {
                    members: { $in: [req.user._id] },
                    status: true,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        uid: '$members'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$uid']
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
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    let: {
                        uid: '$job_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$uid']
                                }

                            }
                        },
                        {
                            $project: {
                                title: 1,
                            }
                        }
                    ],
                    as: 'jobData'
                }
            },
            { $unwind: { path: "$jobData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        uid: '$last_message_by'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$uid']
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
                    as: 'last_message_by_detail'
                }
            },
            { $unwind: { path: "$last_message_by_detail", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'chat_datas',
                    let: {
                        roomId: '$_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$room_id', '$$roomId'] },
                                        { $eq: ['$type', 'typing'] }
                                    ]
                                }

                            }
                        },

                    ],
                    as: 'typingData'
                }
            },
            { $unwind: { path: "$typingData", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    myUnseenCount: { $filter: { input: "$unseen_count", as: "ele", cond: { $eq: ["$$ele.user_id", req.user._id] } } }
                }
            },
            {
                $project: {
                    name: { $cond: { if: '$jobData.title', then: '$jobData.title', else: '' } },
                    room_image: '$room_image',
                    createdBy: '$createdBy',
                    last_message_text: '$last_message_text',
                    last_message_at: '$last_message_at',
                    last_message_by: '$last_message_by',
                    other_member: { $filter: { input: "$users", as: "user", cond: { $ne: ["$$user._id", req.user._id] } } },
                    is_online: "true",
                    created_on: "$created_on",
                    last_message_by_detail: '$last_message_by_detail',
                    unseen_count: { $first: '$myUnseenCount.count' },
                    typing: { $cond: { if: '$typingData', then: true, else: false } },
                    typing_by: '$typingData.from_id',
                    isDeleted: '$isDeleted',

                }
            },
            {
                $match: conditions
            },
            {
                $sort: {
                    last_message_at: -1
                }
            }

        ]);
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            console.log(e);
            throw e;
        }
    },


    getAllByField: async (params) => {
        let record = await Chat.find(params).exec();
        try {
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
            let record = await Chat.findOne(params).exec();
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            return e;
        }
    },

    getNotepad: async (room_id, user_id) => {
        try {
            let record = await ChatRoom.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(room_id),
                        isDeleted: false
                    }
                },
                {
                    $addFields: {
                        filteredNotes: {
                            "$filter": {
                                "input": "$notepad",
                                "as": "noteData",
                                "cond": {
                                    "$eq": [
                                        "$$noteData.user_id",
                                        user_id
                                    ]
                                }
                            },
                        }
                    }
                },
                { $unwind: { path: "$filteredNotes", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        notes: '$filteredNotes.notes'
                    }
                },


            ])
            if (record && record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            return e;
        }
    },

    getAllByFieldChatRoom: async (params) => {
        let record = await ChatRoom.find(params).exec();
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },


    updateById: async (id, data) => {
        try {
            let record = await Chat.findByIdAndUpdate(id, data, {
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

    updateByField: async (params, data) => {

        try {
            let record = await Chat.updateOne(params, data);
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },


    updateRoomNotepad: async (chatId, userId, notes) => {
        try {

            let count = await ChatRoom.updateOne({ _id: mongoose.Types.ObjectId(chatId), notepad: { $elemMatch: { user_id: userId } } }, {
                '$set':
                    { 'notepad.$.notes': notes }
            });

            if (!count) {
                return null;
            }
            return count;

        } catch (e) {
            throw e;
        }
    },

    getChats: async (id) => {

        let record = await Chat.aggregate([
            {
                $match: {
                    room_id: mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        uid: '$from_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$uid']
                                }

                            }
                        },
                        {
                            $project: {
                                profile_image: 1,
                                time_zone: 1
                            }
                        }
                    ],
                    as: 'userData'
                }
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    profile_image: '$userData.profile_image',
                    from_id: '$from_id',
                    text: '$text',
                    files: '$files',
                    reactions: '$reactions',
                    room: '$room_id',
                    chat_type: '$type',
                    createdAt: '$createdAt'
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]);
        // console.log(record);
        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },


    getbyFieldCustom: async (req) => {
        try {
            let record = await ChatRoom.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            uid: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid']
                                    }

                                }
                            },
                            {
                                $project: {
                                    title: 1,
                                }
                            }
                        ],
                        as: 'jobData'
                    }
                },
                { $unwind: { path: "$jobData", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'proposals',
                        let: {
                            uid: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$job_id', '$$uid'] },
                                            { $eq: ['$proposal_status', 'Accepted'] }
                                        ]
                                    }

                                }
                            }
                        ],
                        as: 'proposalData'
                    }
                },
                { $unwind: { path: "$proposalData", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            uid: '$members'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$uid']
                                    }

                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1,
                                    time_zone: 1
                                }
                            }
                        ],
                        as: 'users'
                    }
                },
                {
                    $addFields: {
                        other_members: { $first: { $filter: { input: "$users", as: "user", cond: { $ne: ["$$user._id", req.user._id] } } } },
                    }
                },
                {
                    $project: {
                        room_image: '$room_image',
                        name: '$jobData.title',
                        other_member: { $filter: { input: "$users", as: "user", cond: { $ne: ["$$user._id", req.user._id] } } },
                        job_id: '$job_id',
                        proposal_id: '$proposalData._id',
                        time_zone: '$other_members.time_zone'
                    }
                }
            ])
            if (record.length > 0) {
                return record[0];
            } else {
                return {};
            }


        } catch (e) {
            return e;
        }
    },

    getRoomById: async (id) => {
        try {
            let record = await ChatRoom.findById(id).lean().exec();
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
            let datas = await Chat.create(data);
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    updateLast: async (id, data) => {
        try {
            let datas = await ChatRoom.findByIdAndUpdate(id, data, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    updateRoomStatus: async (id) => {
        try {
            let datas = await ChatRoom.findByIdAndUpdate(id, { status: true }, { new: true });
            if (!datas) {
                return null;
            }
            return datas;
        } catch (e) {
            throw e;
        }
    },

    deleteTypingChat: async (userId, room) => {
        try {

            let findChat = await Chat.findOne({
                from_id: mongoose.Types.ObjectId(userId),
                room_id: mongoose.Types.ObjectId(room),
                type: 'typing'
            });

            let deleted = await Chat.deleteMany({
                from_id: mongoose.Types.ObjectId(userId),
                room_id: mongoose.Types.ObjectId(room),
                type: 'typing'
            });

            if (!deleted) {
                return {};
            }
            return findChat;

        } catch (e) {
            throw e;
        }
    },

    deleteTyping: async (userId) => {
        try {
            let deleted = await Chat.deleteMany({
                from_id: mongoose.Types.ObjectId(userId),
                type: 'typing'
            });
            console.log(deleted);
            if (!deleted) {
                return null;
            }
            return deleted;

        } catch (e) {
            throw e;
        }
    },


    chatCount: async (chatId, userId, cnt) => {
        try {

            let count = await ChatRoom.updateOne({ _id: mongoose.Types.ObjectId(chatId), unseen_count: { $elemMatch: { user_id: userId } } }, {
                '$set':
                    { 'unseen_count.$.count': cnt }
            });

            // console.log(count);
            if (!count) {
                return null;
            }
            return count;

        } catch (e) {
            throw e;
        }
    },


    getUnseenRoomCount: async (userId) => {
        try {

            let count = await ChatRoom.find({ 'unseen_count': { $elemMatch: { user_id: userId, count: { $gt: 0 } } } }).count();

            if (!count) {
                return 0;
            }
            return count;

        } catch (e) {
            throw e;
        }
    },


    findRoom: async (jobId, userId) => {
        try {

            let data = await ChatRoom.find({ job_id: mongoose.Types.ObjectId(jobId), members: { $in: [mongoose.Types.ObjectId(userId)] } });

            if (data.length > 0) {
                return data[0];
            } else {
                return {};
            }


        } catch (e) {
            throw e;
        }
    },


    getChatRoomDetails: async (req) => {
        try {
            let record = await ChatRoom.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        let: {
                            uid: '$job_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid']
                                    }

                                }
                            },
                            {
                                $project: {
                                    title: 1,
                                    description: 1
                                }
                            }
                        ],
                        as: 'jobData'
                    }
                },
                { $unwind: { path: "$jobData", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            uid: '$members'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$uid']
                                    }

                                }
                            },
                            {
                                $project: {
                                    full_name: 1,
                                    profile_image: 1,
                                    cityName: 1,
                                    countryName: 1,
                                    location: 1
                                }
                            }
                        ],
                        as: 'users'
                    }
                },
                {
                    $addFields: {
                        other_member: { $filter: { input: "$users", as: "user", cond: { $ne: ["$$user._id", req.user._id] } } },
                    }
                },
                { $unwind: { path: "$other_member", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        filteredNotes: {
                            "$filter": {
                                "input": "$notepad",
                                "as": "noteData",
                                "cond": {
                                    "$eq": [
                                        "$$noteData.user_id",
                                        req.user._id
                                    ]
                                }
                            },
                        }
                    }
                },
                { $unwind: { path: "$filteredNotes", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        room_image: '$room_image',
                        room_name: { $concat: ['$jobData.title', ' - ', '$other_member.full_name'] },
                        location: '$other_member.location',
                        time: {
                            $dateToString: { date: new Date(), timezone: "America/New_York" }
                        },
                        job_description: '$jobData.description',
                        notepad: '$filteredNotes.notes',
                        all_members: '$users'

                    }
                }
            ])
            if (record && record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            throw e;
        }
    },


    getRoomFiles: async (id, keyword) => {
        try {

            //stage 1
            let func = [
                {
                    $match: {
                        room_id: mongoose.Types.ObjectId(id),
                        files: {
                            $ne: []
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            uid: '$from_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid']
                                    }

                                }
                            },


                        ],
                        as: 'fromUser'
                    }
                },
                { $unwind: { path: "$fromUser", preserveNullAndEmptyArrays: true } },
                {
                    "$addFields": {
                        files_list: {
                            $map: {
                                input: "$files",
                                as: "file",
                                in: {
                                    "$mergeObjects": [
                                        "$$file",
                                        {
                                            createdAt: "$createdAt",
                                            from_user: '$fromUser.full_name'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        room_id: '$room_id',
                        chatData: '$files_list',
                        createdAt: '$createdAt'
                    }
                },
                {
                    $group: {
                        _id: '$room_id',
                        files: { $push: '$chatData' }
                    }
                },
                { $unwind: { path: "$files", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$files", preserveNullAndEmptyArrays: true } },

            ];


            //stage 2
            if (keyword) {
                func.push({
                    $match: {
                        "files.file": { $regex: (keyword.trim()).replace(/([-[\]{}()*+?.\\^$|#,])/g, ""), $options: 'i' }
                    }
                });
            }

            //stage 3
            func.push({
                $group: {
                    _id: '$_id',
                    files: { $addToSet: '$files' }
                }
            });

            let record = await Chat.aggregate(func);

            if (record && record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            throw e;
        }
    },

    getRoomLinks: async (id, keyword) => {
        try {

            //stage 1
            let func = [
                {
                    $match: {
                        room_id: mongoose.Types.ObjectId(id),
                        text: { $regex: /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#.]?[\w-]+)*\/?/, $options: 'i' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            uid: '$from_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid']
                                    }

                                }
                            },


                        ],
                        as: 'fromUser'
                    }
                },
                { $unwind: { path: "$fromUser", preserveNullAndEmptyArrays: true } },

            ];


            //stage 2
            if (keyword) {
                func.push({
                    $match: {
                        "text": { $regex: (keyword.trim()).replace(/([-[\]{}()*+?.\\^$|#,])/g, ""), $options: 'i' }
                    }
                });
            }

            //stage 3
            func.push({
                $group: {
                    _id: '$room_id',
                    links: { $push: { link: '$text', createdAt: '$createdAt', from_user: '$fromUser.full_name' } }
                }
            });

            let record = await Chat.aggregate(func);

            if (record && record.length > 0) {
                return record[0];
            } else {
                return null;
            }


        } catch (e) {
            throw e;
        }
    },

    searchInChat: async (room_id, keyword) => {

        let record = await Chat.aggregate([
            {
                $match: {
                    room_id: mongoose.Types.ObjectId(room_id),
                    isDeleted: false,
                    text: { $regex: (keyword.trim()).replace(/([-[\]{}()*+?.\\^$|#,])/g, ""), $options: 'i' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        uid: '$from_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$uid']
                                }

                            }
                        },


                    ],
                    as: 'fromUser'
                }
            },
            { $unwind: { path: "$fromUser", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    text: 1,
                    from_user: '$fromUser.full_name',
                    from_user_profile_image: '$fromUser.profile_image',
                    createdAt: 1
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]);

        try {
            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

};

module.exports = chatRepository;