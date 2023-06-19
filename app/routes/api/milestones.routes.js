const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const milestonesController = require('WEBSERVICES/milestones.controller');
const multer = require('multer');
const fs = require('fs');


const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/milestones")) {
			fs.mkdirSync("./public/uploads/milestones");
		}
        callback(null, "./public/uploads/milestones");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 


//Authorization
namedRouter.all("/milestone*", auth.authenticateAPI);



/**
 * @swagger
 * /milestone/add:
 *   post:
 *     summary: Add milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Add milestone
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - job_id
 *                 - name
 *                 - due_date
 *                 - amount
 *                 - description
 *             properties:
 *                 job_id:
 *                     type: string
 *                 name:
 *                     type: string
 *                 due_date:
 *                     type: string
 *                 amount:
 *                     type: number
 *                 description:
 *                      type: string
 *                 
 *     responses:
 *        200:
 *          description: Milestone created Successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */
namedRouter.post('api.milestone.add', '/milestone/add', request_param.any(), milestonesController.AddMilestone);



/**
 * @swagger
 * /milestone/status:
 *   post:
 *     summary: Accept / Reject / Modify milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Accept / Reject / Modify milestone
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - milestone
 *                 - job_id
 *                 - status
 *                 - comment

 *             properties:
 *                 milestone:
 *                     type: string
 *                 job_id:
 *                     type: string
 *                 status:
 *                     type: string
 *                     example: 'Accept / Decline / Modify'
 *                 comment:
 *                     type: string
 *                 
 *     responses:
 *        200:
 *          description: Milestone accepted Successfully.
 *        
 */
namedRouter.post('api.milestone.status', '/milestone/status', request_param.any(), milestonesController.AcceptRejectMileStone);


/**
 * @swagger
 * /milestone/list/{id}:
 *   get:
 *     summary: Get milestone list by Job id
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: JOB ID
 *     responses:
 *        200:
 *          description: Milestone list and Job details fetched Successfully.
 *        
 */
namedRouter.get('api.milestone.list', '/milestone/list/:id', request_param.any(), milestonesController.milestoneListByJob);


/**
 * @swagger
 * /milestone/delete/{id}:
 *   get:
 *     summary: Delete milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Milestone id
 *     responses:
 *        200:
 *          description: Milestone deleted Successfully.
 *        
 */
namedRouter.get('api.milestone.delete', '/milestone/delete/:id', request_param.any(), milestonesController.DeleteMilestone);


/**
 * @swagger
 * /milestone/edit/{id}:
 *   post:
 *     summary: Update milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Milestone id
 *         - name: body
 *           in: body
 *           description: Add milestone
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - name
 *                 - description
 *                 - due_date
 *                 - amount
 *             properties:
 *                 name:
 *                     type: string
 *                 description:
 *                     type: string
 *                 due_date:
 *                     type: string
 *                 amount:
 *                     type: number
 *                 
 *     responses:
 *        200:
 *          description: Milestone updated Successfully.
 *        
 */
namedRouter.post('api.milestone.edit', '/milestone/edit/:id', request_param.any(), milestonesController.EditMilestone);



/**
 * @swagger
 * /milestone/payment:
 *   post:
 *     summary: Payment for milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Payment for milestone
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - card_number
 *                 - exp_month
 *                 - exp_year
 *                 - cvv
 *                 - milestone_id
 *             properties:
 *                 card_number:
 *                     type: string
 *                 exp_month:
 *                     type: string
 *                 exp_year:
 *                     type: string
 *                 cvv:
 *                     type: string
 *                 milestone_id:
 *                     type: string
 *     responses:
 *        200:
 *          description: Milestone payment cleared successfully.
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

namedRouter.post('api.milestone.payment', '/milestone/payment', request_param.any(), milestonesController.milestonePayment);


/**
 * @swagger
 * /milestone/submit/{id}:
 *   post:
 *     summary: Payment for milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Milestone id
 *         - name: job_submit_image
 *           in: formData
 *           type: file
 *           description: Milestone Submit Image
 *           required: true
 *         - name: job_submit_description
 *           in: formData
 *           type: string
 *           description: Milestone Submit Image
 *           required: true
 *     responses:
 *        200:
 *          description: Milestone submited successfully.
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */
namedRouter.post('api.milestone.submit', '/milestone/submit/:id', uploadFile.any(), milestonesController.SubmitMilestone);



/**
 * @swagger
 * /milestone/complete/{id}:
 *   get:
 *     summary: Complete milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Milestone id
 *     responses:
 *        200:
 *          description: Milestone Marked as Complete Successfully.
 *        
 */
namedRouter.get('api.milestone.complete', '/milestone/complete/:id', request_param.any(), milestonesController.CompleteMilestone);


/**
 * @swagger
 * /milestone/request/{id}:
 *   get:
 *     summary: Request for a new milestone
 *     security:
 *       - Token: []
 *     tags:
 *       - Milestone
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Job id
 *     responses:
 *        200:
 *          description: Request notification sent successfully.
 *        
 */
namedRouter.get('api.milestone.request', '/milestone/request/:id', request_param.any(), milestonesController.requestMilestone);



// Export the express.Router() instance
module.exports = router;