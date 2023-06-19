const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const jobController = require('WEBSERVICES/job.controller');

const multer = require('multer');
const request_param = multer();

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./public/uploads/jobs")) {
            fs.mkdirSync("./public/uploads/jobs");
        }
        callback(null, "./public/uploads/jobs");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});


/**
 * @swagger
 * /job/detail/{id}:
 *   get:
 *     summary: Get job details by job id
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     responses:
 *        200:
 *          description: Job details fetched successfully.
 *        
 */
namedRouter.get('api.job.detail', '/job/detail/:id',  jobController.getJobDetails);

//authentication
namedRouter.all('/job*', auth.authenticateAPI);


/**
 * @swagger
 * /job/getall:
 *   get:
 *     summary: Get all Job Request by User Id
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All Job fetched successfully.
 *        
 */


namedRouter.get('api.job.getall', '/job/getall',  jobController.getAllJobByUserId);



/**
 * @swagger
 * /job/submit:
 *   post:
 *     summary: Submit Job
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: files
 *           type: array
 *           description: Choose Images/ Videos
 *           items:
 *             type: file
 *         - in: formData
 *           name: description_attachment
 *           type: array
 *           description: Choose Attachments
 *           items:
 *             type: file
 *         - name: body
 *           in: body
 *           description: Submit Job
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - email
 *                 - category
 *                 - title
 *                 - description
 *                 - location
 *                 - budget
 *                 - deadline
 *                 - region
 *                 - district
 *                 - suburb
 *             properties:
 *                 email:
 *                     type: string
 *                 category:
 *                     type: string
 *                 title:
 *                     type: string
 *                 description:
 *                     type: string
 *                 location:
 *                     type: string
 *                 budget:
 *                      type: number
 *                 deadline:
 *                      type: number
 *                 region:
 *                     type: string
 *                 district:
 *                     type: string
 *                 suburb:
 *                     type: string
 *                 
 *     responses:
 *        200:
 *          description: Job Saved successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

 namedRouter.post('api.job.submit', '/job/submit', uploadFile.any(), jobController.saveJob);



/**
 * @swagger
 * /job/open:
 *   get:
 *     summary: Get all Jobs by category open for bidding
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: category
 *         type: string
 *                 
 *     responses:
 *        200:
 *          description: All Job fetched successfully.
 *        
 */


 namedRouter.get('api.job.open', '/job/open',  jobController.openJobByCategory);



 /**
 * @swagger
 * /job/accepted/list:
 *   get:
 *     summary: Get accepted job list with details
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: All Jobs fetched successfully.
 *        
 */
 namedRouter.get('api.job.accepted.list', '/job/accepted/list',  jobController.getAllAcceptedJobByUser);

  /**
 * @swagger
 * /job/complete/{id}:
 *   get:
 *     summary: Mark job as complete
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Job id
 *     responses:
 *        200:
 *          description: All Jobs fetched successfully.
 *        
 */
  namedRouter.get('api.job.complete', '/job/complete/:id',  jobController.CompleteJob);


/**
 * @swagger
 * /job/invoices:
 *   get:
 *     summary: Job Invoices
 *     security:
 *       - Token: []
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: query
 *           name: stat
 *           type: string
 *           description: Status of Payment ( "Paid" or "Unpaid")
 *     responses:
 *        200:
 *          description: Invoices fetched successfully.
 *        
 */
  namedRouter.get('api.job.invoices', '/job/invoices',  jobController.getAllInvoices);



module.exports = router;