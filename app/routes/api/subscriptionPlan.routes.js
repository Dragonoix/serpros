const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const subscriptionPlanController = require('WEBSERVICES/subscriptionPlan.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /subscription-plan/getall:
 *   get:
 *     summary: Get all Subscription Plan
 *     tags:
 *       - SubscriptionPlan
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All Subscription Plan fetched successfully.
 *        
 */


namedRouter.get('api.subscription-plan.getall', '/subscription-plan/getall',  subscriptionPlanController.getAllSubscriptionPlan);


namedRouter.all('/subscription-plan*', auth.authenticateAPI);


/**
 * @swagger
 * /subscription-plan/purchase:
 *   post:
 *     summary: Purchase subscription plan
 *     security:
 *       - Token: []
 *     tags:
 *       - SubscriptionPlan
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Purchase subscription plan
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - card_number
 *                 - exp_month
 *                 - exp_year
 *                 - cvv
 *                 - payment_amount
 *                 - subscription_plan_id
 *             properties:
 *                 card_number:
 *                     type: string
 *                 exp_month:
 *                     type: string
 *                 exp_year:
 *                     type: string
 *                 cvv:
 *                     type: string
 *                 payment_amount:
 *                     type: string
 *                 subscription_plan_id:
 *                     type: string
 *     responses:
 *        200:
 *          description: Review Saved successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

namedRouter.post('api.subscription-plan.purchase', '/subscription-plan/purchase',  subscriptionPlanController.purchaseSubscription);



module.exports = router;