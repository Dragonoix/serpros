const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const notificationController = require('WEBSERVICES/notification.controller');
const multer = require('multer');
const fs = require('fs');


const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/notification")) {
			fs.mkdirSync("./public/uploads/notification");
		}
        callback(null, "./public/uploads/notification");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 


namedRouter.all("/notification*", auth.authenticateAPI);



/**
 * @swagger
 * /notification/list:
 *   get:
 *     summary: Notification List
 *     security:
 *       - Token: []
 *     tags:
 *       - Notification
 *     produces:
 *       - application/json

 *     responses:
 *        200:
 *          description: Notification list fetched successfully
 *        
 */
namedRouter.get('api.notification.list', '/notification/list', request_param.any(), notificationController.notificationListByUser);


/**
 * @swagger
 * /notification/count:
 *   get:
 *     summary: Unseen Notification Count
 *     security:
 *       - Token: []
 *     tags:
 *       - Notification
 *     produces:
 *       - application/json

 *     responses:
 *        200:
 *          description: New notification count successfully
 *        
 */
namedRouter.get('api.notification.count', '/notification/count', request_param.any(), notificationController.unseenNotificationCount);


/**
 * @swagger
 * /notification/seen:
 *   get:
 *     summary: Set all notifications as seen
 *     security:
 *       - Token: []
 *     tags:
 *       - Notification
 *     produces:
 *       - application/json

 *     responses:
 *        200:
 *          description: New notification seen successfully
 *        
 */
namedRouter.get('api.notification.seen', '/notification/seen', request_param.any(), notificationController.seen);




// Export the express.Router() instance
module.exports = router;