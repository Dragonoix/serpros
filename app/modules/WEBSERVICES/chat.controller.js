const express = require("express");
const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const chatRepo = require("chat/repositories/chat.repository");
const userRepo = require("user/repositories/user.repository");
const jobRepo = require("job/repositories/job.repository");
const mailer = require("../../helper/mailer.js");

const socket = require("../../../serpros");

const mime = require('mime-types')



class ChatController {
    constructor() { }



    async createRoom(req, res) {
        try {
            if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                return requestHandler.throwError(400, 'Bad Request', 'Job Id Is Required')();
            }
            let findRoom = await chatRepo.findRoom(req.body.job_id, req.user._id);
            if (!_.isEmpty(findRoom)) {
                return requestHandler.sendSuccess(res, 'Chat room fetched Successfully')(findRoom);
            }
            let jobData = await jobRepo.getById(req.body.job_id);
            let roomData = await chatRepo.createRoom({
                created_by: req.user._id,
                members: [req.user._id, jobData.userId],
                unseen_count: [{ user_id: jobData.userId, count: 0 }, { user_id: req.user._id, count: 0 }],
                notepad: [{ user_id: jobData.userId, notes: "" }, { user_id: req.user._id, notes: "" }],
                job_id: req.body.job_id
            });

            requestHandler.sendSuccess(res, 'Chat room created Successfully')(roomData);
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async GetChatWithList(req, res) {
        try {

            var data = await chatRepo.getChatWithList(req)

            requestHandler.sendSuccess(res, 'Chat List Fetched Successfully')(data);
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async getChats(req, res) {
        try {

            let data = await chatRepo.getChats(req.params.id);
            let chatDetail = await chatRepo.getbyFieldCustom(req);

            requestHandler.sendSuccess(res, 'Chats Fetched Successfully')({ chats: data, chatDetail });


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async updateChatRoomStats(req, res) {
        try {

            let data = await chatRepo.updateRoomStatus(req.params.id);

            requestHandler.sendSuccess(res, 'Chat Room status updated successfully')(data);


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async saveChatAttachments(req, res) {
        try {
            req.body.from_id = req.user._id;
            req.body.type = 'file';
            if (_.has(req, 'files')) {
                let attachments = [];
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'files') {
                            let fileName = req.files[i].filename;
                            let fileType = (mime.lookup(fileName)).split('/')[0];
                            // console.log(fileType);
                            attachments.push({ file: fileName, type: fileType });
                        }
                    }
                    req.body.files = attachments;
                }
            }

            let saveRecord = await chatRepo.save(req.body);
            if (!_.isEmpty(saveRecord)) {

                let updateData = await chatRepo.updateLast(req.body.room_id, {
                    last_message_text: '📎 attachment',
                    last_message_at: new Date(), last_message_by: req.user._id
                });

                if (!_.isEmpty(updateData)) {
                    updateData.unseen_count.forEach(async (item) => {
                        if (item.user_id.toString() != req.user._id.toString()) {
                            await chatRepo.chatCount(req.body.room_id, item.user_id, (item.count + 1));
                        }

                    });

                }

                socket.ioObject.sockets.in(req.body.room_id).emit("message", saveRecord); // emit to room
                let chatRoom = await chatRepo.getRoomById(req.body.room_id);

                if (!_.isEmpty(chatRoom)) {
                    chatRoom.members.forEach((ele) => {
                        let emitTo = (ele.toString()) + 'newMsg';
                        let unseenRoomCount = (ele.toString()) + 'NewChat';

                        socket.ioObject.sockets.emit(emitTo, saveRecord); // broadcast to all existinc users
                        socket.ioObject.sockets.emit(unseenRoomCount, savedChat);
                    })
                }

                requestHandler.sendSuccess(res, 'Chat file saved Successfully')(saveRecord);

            } else {
                requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async unseenRoomCount(req, res) {
        try {

            let count = await chatRepo.getUnseenRoomCount(req.user._id);

            requestHandler.sendSuccess(res, 'Unseen chat room count fetched successfully')({ count: count });


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async sendEmail(req, res) {
        try {

            if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                return requestHandler.throwError(400, 'Bad Request', 'Job Id Is Required')();
            }

            let jobData = await jobRepo.getById(req.body.job_id);
            if (_.isEmpty(jobData)) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid Job Id')();
            }
            let to_user = await userRepo.getById(jobData.userId);

            if (!_.has(req.body, 'message') || (_.has(req.body, 'message') && _.isUndefined(req.body.message)) || _.isNull(req.body.message)) {
                return requestHandler.throwError(400, 'Bad Request', 'Message Is Required')();
            }
            let sentmail = await mailer.sendMailViaGmail(to_user.email, jobData.title+' || Message', 'project-enquiry', {
                fullName: req.user.full_name, 
                message: req.body.message
            });

            if(_.isArray(sentmail.accepted) && sentmail.accepted.length > 0) {
                requestHandler.sendSuccess(res, 'Mail Sent Successfully')();
            } else {
                requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")(sentmail);
            }

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async getChatDetail(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid id')();
            }
            let data = await chatRepo.getChatRoomDetails(req);

            requestHandler.sendSuccess(res, 'Chat Room Detail Fetched Successfully')(data);


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async getChatRoomFiles(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid id')();
            }
            let payload = {};
            let files = await chatRepo.getRoomFiles(req.params.id, req.query.keyword);
            if(_.has(files, 'files')) {
                let objFiles = files.files.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
                payload['files'] = objFiles;
            } else {
                payload['files'] = [];
            }
            let links = await chatRepo.getRoomLinks(req.params.id, req.query.keyword);
            if(_.has(links, 'links')) {
                let objLinks = links.links.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
                payload['links'] = objLinks;
            } else {
                payload['links'] = [];
            }

            requestHandler.sendSuccess(res, 'Chat Room Files Fetched Successfully')(payload);

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async updateRoomImage(req, res) {
        try {

            if (!_.has(req.body, 'room_id') || ((_.has(req.body, 'room_id') && (_.isUndefined(req.body.room_id)) || _.isNull(req.body.room_id) || _.isEmpty(req.body.room_id.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Room Id is required!')();
            }
            if (!mongoose.isValidObjectId(req.body.room_id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid Room Id')();
            }
            if (req.files && req.files.length) {
                for (let file of req.files) {
                    if (file.fieldname == 'room_image') {
                        req.body.room_image = file.filename;
                    }
                }
            }

            if (!_.has(req.body, 'room_image') || ((_.has(req.body, 'room_image') && (_.isUndefined(req.body.room_image)) || _.isNull(req.body.room_image) || _.isEmpty(req.body.room_image.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Image is required!')();
            }
            let data = await chatRepo.updateLast(req.body.room_id, {room_image: req.body.room_image });

            requestHandler.sendSuccess(res, 'Chat Room Image Updated Successfully')({});


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async updateNotepad(req, res) {
        try {
            if (!_.has(req.body, 'room_id') || ((_.has(req.body, 'room_id') && (_.isUndefined(req.body.room_id)) || _.isNull(req.body.room_id) || _.isEmpty(req.body.room_id.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Room Id is required!')();
            }
            
            if (!mongoose.isValidObjectId(req.body.room_id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid Room Id')();
            }
            if (!_.has(req.body, 'notes') || ((_.has(req.body, 'notes') && (_.isUndefined(req.body.notes)) || _.isNull(req.body.notes) ))) {
                return requestHandler.throwError(400, 'Bad Request', 'Notes is required!')();
            }

            let data = await chatRepo.updateRoomNotepad(req.body.room_id, req.user._id, req.body.notes);;

            requestHandler.sendSuccess(res, 'Notepad Updated Successfully')(data);


        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async getChatRoomNotepad(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid id')();
            }
            let data = await chatRepo.getNotepad(req.params.id, req.user._id);

            requestHandler.sendSuccess(res, 'Chat Room Notepad Fetched Successfully.')(data);

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async searchChat(req, res) {
        try {
            if (!_.has(req.body, 'room_id') || ((_.has(req.body, 'room_id') && (_.isUndefined(req.body.room_id)) || _.isNull(req.body.room_id) || _.isEmpty(req.body.room_id.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Room Id is required!')();
            }
            
            if (!mongoose.isValidObjectId(req.body.room_id) ) {
                return requestHandler.throwError(400, 'Bad Request', 'Invalid Room Id')();
            }
            let chatDetail = await chatRepo.searchInChat(req.body.room_id, req.body.keyword);

            requestHandler.sendSuccess(res, 'Search result fetched successfully.')(chatDetail);

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


};

module.exports = new ChatController()

