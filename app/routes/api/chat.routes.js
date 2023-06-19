const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const chatController = require('WEBSERVICES/chat.controller');

const multer = require('multer');

const request_param = multer();

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if(file.fieldname == "room_image") {
            if (!fs.existsSync("./public/uploads/chatRoom")) {
                fs.mkdirSync("./public/uploads/chatRoom");
            }
            callback(null, "./public/uploads/chatRoom");
        } else {
            if (!fs.existsSync("./public/uploads/chat")) {
                fs.mkdirSync("./public/uploads/chat");
            }
            callback(null, "./public/uploads/chat");
        }

    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "@" + file.originalname);
    }
});

const uploadFile = multer({
    storage: Storage
});



//authentication
namedRouter.all('/chat*', auth.authenticateAPI);

/**
 * @swagger
 * /chat/list:
 *   post:
 *     summary: Get chat list
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Chat List Fetched Successfully.
 *        
 */


namedRouter.post('api.chat.list', '/chat/list',  chatController.GetChatWithList);

/**
 * @swagger
 * /chat/chats/{id}:
 *   get:
 *     summary: Get all Chats
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     responses:
 *        200:
 *          description: Chats Fetched Successfully.
 *        
 */
namedRouter.get('api.chat.chats', '/chat/chats/:id',  chatController.getChats);


/**
 * @swagger
 * /chat/attachments:
 *   post:
 *     summary: Upload chat files
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         description: Choose Images
 *         items:
 *           type: file
 *       - in: formData
 *         name: room_id
 *         type: string
 *       - in: formData
 *         name: text
 *         type: string
 *     responses:
 *        200:
 *          description: Chat file saved Successfully.
 *        400:
 *          description: Something Went Wrong.
 *        500:
 *          description: Server Error.
 *        
 */
namedRouter.post('api.chat.attachments', '/chat/attachments',  uploadFile.any(), chatController.saveChatAttachments);

/**
 * @swagger
 * /chat/room-status/{id}:
 *   get:
 *     summary: Update chat room status
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     responses:
 *        200:
 *          description: Chat Room status updated successfully.
 *        
 */
namedRouter.get('api.chat.room-status', '/chat/room-status/:id',  chatController.updateChatRoomStats);

/**
 * @swagger
 * /chat/unseen-room:
 *   get:
 *     summary: Get unseen chat room count
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Unseen chat room count fetched successfully
 *        
 */
namedRouter.get('api.chat.unseen-room', '/chat/unseen-room',  chatController.unseenRoomCount);



/**
 * @swagger
 * /chat/create-room:
 *   post:
 *     summary: Create chat room
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     parameters:
 *         - name: body
 *           in: body
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - job_id
 *                 
 *             properties:
 *                 job_id:
 *                     type: string
 *                 
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Chat room created successfully
 *        
 */
namedRouter.post('api.chat.create-room', '/chat/create-room',  chatController.createRoom);



/**
 * @swagger
 * /chat/send-mail:
 *   post:
 *     summary: Send Email
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     parameters:
 *         - name: body
 *           in: body
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - job_id
 *                 - message
 *             properties:
 *                 job_id:
 *                     type: string
 *                 message:
 *                     type: string
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Mail Sent Successfully.
 *        
 */
namedRouter.post('api.chat.send-mail', '/chat/send-mail',  chatController.sendEmail);


/**
 * @swagger
 * /chat/room/detail/{id}:
 *   get:
 *     summary: Get chat room details
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     responses:
 *        200:
 *          description: Chat Room Detail Fetched Successfully
 *        
 */
namedRouter.get('api.chat.room.detail', '/chat/room/detail/:id',  chatController.getChatDetail);


/**
 * @swagger
 * /chat/room/files/{id}:
 *   get:
 *     summary: Get chat room files
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *         - in: query
 *           name: keyword
 *           schema:
 *              type: string
 *           description: Enter File Search Keyword 
 *     responses:
 *        200:
 *          description: Chat Room Files Fetched Successfully.
 *        
 */
namedRouter.get('api.chat.room.files', '/chat/room/files/:id',  chatController.getChatRoomFiles);


/**
 * @swagger
 * /chat/room/update-image:
 *   post:
 *     summary: Upload chat room image
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: room_image
 *         type: file
 *       - in: formData
 *         name: room_id
 *         type: string

 *     responses:
 *        200:
 *          description: Chat Room Image Updated Successfully.
 *        400:
 *          description: Something Went Wrong.
 *        500:
 *          description: Server Error.
 *        
 */
namedRouter.post('api.chat.room.update-image', '/chat/room/update-image', uploadFile.any(), chatController.updateRoomImage);

/**
 * @swagger
 * /chat/room/update-notes:
 *   post:
 *     summary: Update Notepad in chat room
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     parameters:
 *         - name: body
 *           in: body
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - room_id
 *                 - notes
 *             properties:
 *                 room_id:
 *                     type: string
 *                 notes:
 *                     type: string
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Notepad Updated Successfully.
 *        
 */
namedRouter.post('api.chat.room.update-notes', '/chat/room/update-notes', chatController.updateNotepad);


/**
 * @swagger
 * /chat/room/notepad/{id}:
 *   get:
 *     summary: Get notepad from chat room
 *     tags:
 *       - Chat
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     responses:
 *        200:
 *          description: Chat Room Notepad Fetched Successfully.
 *        
 */
namedRouter.get('api.chat.room.notepad', '/chat/room/notepad/:id',  chatController.getChatRoomNotepad);


/**
 * @swagger
 * /chat/search:
 *   post:
 *     summary: Search chat
 *     tags:
 *       - Chat
 *     security:
 *       - Token: []
 *     parameters:
 *         - name: body
 *           in: body
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - room_id
 *                 - keyword
 *             properties:
 *                 room_id:
 *                     type: string
 *                 keyword:
 *                     type: string
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Search result fetched successfully.
 *        
 */
namedRouter.post('api.chat.search', '/chat/search', chatController.searchChat);


module.exports = router;