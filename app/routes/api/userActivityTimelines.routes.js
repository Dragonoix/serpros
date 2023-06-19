const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const userActivityTimelinesController = require('WEBSERVICES/userActivityTimelines.controller');

const multer = require('multer');

const request_param = multer();




//Authorization
namedRouter.all("/activities*", auth.authenticateAPI);

/**
 * @swagger
 * /activities/getall:
 *   get:
 *     summary: Get all activities
 *     security:
 *       - Token: []
 *     tags:
 *       - Activity Timelines
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All activities fetched successfully.
 *        
 */
namedRouter.get('api.activities.getall', '/activities/getall',  userActivityTimelinesController.getMyActivityTimelines);

/**
 * @swagger
 * /activities/partner/activity/{query}:
 *   get:
 *     summary: Get all partner activity
 *     security:
 *       - Token: []
 *     parameters:
 *         - in: path
 *           name: query
 *           type: string
 *     tags:
 *       - Activity Timelines
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Activity list fetched successfully
 *        
 */
namedRouter.get('api.activities.partner.activity', '/activities/partner/activity/:query',  userActivityTimelinesController.getMyPartnerActivity);




module.exports = router;