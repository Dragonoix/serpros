const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const notificationRepo = require("notification/repositories/notification.repository");
const jobRepo = require("job/repositories/job.repository");

class NotificationController {
    constructor() { }


    async notificationListByUser(req, res) {
        try {

            let data = await notificationRepo.getAll({ to_user_id: req.user._id, isDeleted: false, status: 'Active' });
            if (!_.isEmpty(data) && !_.isNull(data)) {
                requestHandler.sendSuccess(res, 'Notification list fetched successfully')(data);
            } else {
                requestHandler.sendSuccess(res, 'Notification not found')([]);
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


    async unseenNotificationCount(req, res) {
        try {
            let count = await notificationRepo.unseenCount({ to_user_id: req.user._id, isDeleted: false, status: 'Active', seen: false });
            requestHandler.sendSuccess(res, 'New notification count successfully.')({count});

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


    async seen(req, res) {
        try {
            let noti = await notificationRepo.updateByFieldMany({ to_user_id: req.user._id, isDeleted: false, status: 'Active', seen: false }, {seen: true});
            requestHandler.sendSuccess(res, 'New notification seen successfully.')({noti});

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }



};


module.exports = new NotificationController();