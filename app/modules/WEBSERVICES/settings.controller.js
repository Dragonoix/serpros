const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const settingsRepo = require("settings/repositories/settings.repository");
const userRepo = require("user/repositories/user.repository");


class SettingsController {
    constructor() { }

    async getSettingsByUser(req, res) {
        try {
            let payload = {}
            let settingsData = await userRepo.getSettingData(req.user._id);

            let availableData = Object.values(settingsData.availabilities)
            
            if (!_.isEmpty(settingsData)) {
                payload = {...settingsData, available: availableData.filter(x => x==true).length, unavailable: availableData.filter(x => x==false).length}
                requestHandler.sendSuccess(res, 'All settings fetched successfully.')(payload);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            logger.storeError({api_url: '/api/settings/user', error_msg: error});
            return requestHandler.sendError(req, res, error);
        }
    };


    async updateAvailability(req, res) {
        try {
            let data = {};
            if (_.has(req.body, 'monday')) {
                data = { 'availabilities.monday': req.body.monday };
            } else if (_.has(req.body, 'tuesday')) {
                data = { 'availabilities.tuesday': req.body.tuesday };
            } else if (_.has(req.body, 'wednesday')) {
                data = { 'availabilities.wednesday': req.body.wednesday };
            } else if (_.has(req.body, 'thursday')) {
                data = { 'availabilities.thursday': req.body.thursday };
            } else if (_.has(req.body, 'friday')) {
                data = { 'availabilities.friday': req.body.friday };
            } else if (_.has(req.body, 'saturday')) {
                data = { 'availabilities.saturday': req.body.saturday };
            } else if (_.has(req.body, 'sunday')) {
                data = { 'availabilities.sunday': req.body.sunday };
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Day name and their status is required.")();
            }

            let settingsData = await userRepo.updateById(data, req.user._id);

            if (!_.isEmpty(settingsData)) {
                requestHandler.sendSuccess(res, 'Availability updated successfully.')({});
            } else {
                requestHandler.throwError(400, 'Bad Request', "Update failed")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    // async updateNotificationSettings(req, res) {
    //     try {
    //         let data = {};
    //         if (_.has(req.body, 'intresting')) {
    //             data = { 'transactional_email_preference.intresting': req.body.intresting };
    //         } else if (_.has(req.body, 'important')) {
    //             data = { 'transactional_email_preference.important': req.body.important };
    //         } else if (_.has(req.body, 'essential')) {
    //             data = { 'transactional_email_preference.essential': req.body.essential };
    //         } else if (_.has(req.body, 'saved_search')) {
    //             data = { 'project_notification_preference.saved_search': req.body.saved_search };
    //         } else if (_.has(req.body, 'project_invitation')) {
    //             data = { 'project_notification_preference.project_invitation': req.body.project_invitation };
    //         } else if (_.has(req.body, 'project_recommendation')) {
    //             data = { 'project_notification_preference.project_recommendation': req.body.project_recommendation };
    //         } else if (_.has(req.body, 'daily_offers')) {
    //             data = { 'marketing_email_preference.daily_offers': req.body.daily_offers };
    //         } else if (_.has(req.body, 'newsletter')) {
    //             data = { 'marketing_email_preference.newsletter': req.body.newsletter };
    //         } else if (_.has(req.body, 'promotions')) {
    //             data = { 'marketing_email_preference.promotions': req.body.promotions };
    //         } else if (_.has(req.body, 'product_updates')) {
    //             data = { 'marketing_email_preference.product_updates': req.body.product_updates };
    //         } else if (_.has(req.body, 'survey')) {
    //             data = { 'marketing_email_preference.survey': req.body.survey };
    //         } else if (_.has(req.body, 'enable_sms_update')) {
    //             data = { 'enable_sms_update': req.body.enable_sms_update };
    //         } else if (_.has(req.body, 'sound_alerts')) {
    //             data = { 'sound_alerts': req.body.sound_alerts };
    //         } else {
    //             return requestHandler.throwError(400, 'Bad Request', "Notification settings key and their status is required.")();
    //         }

    //         let settingsData = await userRepo.updateById(data, req.user._id);

    //         if (!_.isEmpty(settingsData)) {
    //             requestHandler.sendSuccess(res, 'Notification settings updated successfully.')({});
    //         } else {
    //             requestHandler.throwError(400, 'Bad Request', "Update failed")();
    //         }
    //     } catch (error) {
    //         return requestHandler.sendError(req, res, error);
    //     }
    // };

};


module.exports = new SettingsController();