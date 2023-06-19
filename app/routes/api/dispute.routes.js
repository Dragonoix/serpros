const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const disputeController = require('WEBSERVICES/dispute.controller');

const multer = require('multer');

const request_param = multer();






//authentication
namedRouter.all('/dispute*', auth.authenticateAPI);


/**
 * @swagger
 * /dispute/getall/{id}:
 *   get:
 *     summary: Get all dispute by User Id
 *     security:
 *       - Token: []
 *     tags:
 *       - Dispute
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User Id
 *         required: true
 *                 
 *     responses:
 *        200:
 *          description: All disputes fetched successfully.
 *        
 */


namedRouter.get('api.dispute.getall', '/dispute/getall/:id',  disputeController.getAllDisputeById);

/**
 * @swagger
 * /dispute/submit:
 *   post:
 *     summary: Submit Dispute
 *     security:
 *       - Token: []
 *     tags:
 *       - Dispute
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Submit Dispute
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - job_id
 *                 - dispute
 *                 - milestone_id
 *             properties:
 *                 job_id:
 *                     type: string
 *                 dispute:
 *                     type: string
 *                 milestone_id:
 *                     type: string
 *                 
 *     responses:
 *        200:
 *          description: Dispute Saved successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

 namedRouter.post('api.dispute.submit', '/dispute/submit', request_param.any(), disputeController.saveDispute);






module.exports = router;