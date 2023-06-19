const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const settingsController = require('WEBSERVICES/settings.controller');

const multer = require('multer');

const request_param = multer();


//authentication
namedRouter.all('/settings*', auth.authenticateAPI);

/**
 * @swagger
 * /settings/user:
 *   get:
 *     summary: Get user's settings
 *     security:
 *       - Token: []
 *     tags:
 *       - Settings
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All settings fetched successfully.
 *        
 */
namedRouter.get('api.settings.user', '/settings/user',  settingsController.getSettingsByUser);


/**
 * @swagger
 * /settings/update/availability:
 *   post:
 *     summary: Update availability
 *     security:
 *       - Token: []
 *     tags:
 *       - Settings
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Update availability
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - monday
 *             properties:
 *                 monday:
 *                     type: boolean
 *     responses:
 *        200:
 *          description: Availability updated successfully.
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */
namedRouter.post('api.settings.update.availability', '/settings/update/availability', settingsController.updateAvailability);

/**
 * @swagger
 * /settings/update/notification:
 *   post:
 *     summary: Update user's notification settings
 *     security:
 *       - Token: []
 *     tags:
 *       - Settings
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Update user's notification settings
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - intresting
 *             properties:
 *                 intresting:
 *                     type: boolean
 *     responses:
 *        200:
 *          description: Availability updated successfully.
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */
// namedRouter.post('api.settings.update.notification', '/settings/update/notification', settingsController.updateNotificationSettings);






module.exports = router;