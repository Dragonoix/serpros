const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const reviewController = require('WEBSERVICES/review.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /review/getall/{id}:
 *   get:
 *     summary: Get all review by User Id
 *     tags:
 *       - Review
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
 *          description: All reviews fetched successfully.
 *        
 */


namedRouter.get('api.review.getall', '/review/getall/:id',  reviewController.getAllReviewById);


//authentication
namedRouter.all('/review*', auth.authenticateAPI);

/**
 * @swagger
 * /review/submit:
 *   post:
 *     summary: Submit Review
 *     security:
 *       - Token: []
 *     tags:
 *       - Review
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Submit Review
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - review_for_user_id
 *                 - job_id
 *                 - workmanship
 *                 - cost
 *                 - schedule
 *                 - communication
 *                 - review
 *             properties:
 *                 review_for_user_id:
 *                     type: string
 *                 job_id:
 *                     type: string
 *                 workmanship:
 *                     type: number
 *                 cost:
 *                     type: number
 *                 schedule:
 *                     type: number
 *                 communication:
 *                     type: number
 *                 review:
 *                     type: string 
 *     responses:
 *        200:
 *          description: Review Saved successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

 namedRouter.post('api.review.submit', '/review/submit', request_param.any(), reviewController.saveReview);






module.exports = router;