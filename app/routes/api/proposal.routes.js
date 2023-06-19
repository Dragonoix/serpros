const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const proposalController = require('WEBSERVICES/proposal.controller');

const multer = require('multer');


const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/proposal")) {
      fs.mkdirSync("./public/uploads/proposal");
     }
        if(file.fieldname === 'image') {
          callback(null, "./public/uploads/proposal");
      }
      else {
        callback(null, "./public/uploads")
    }
  },
  filename: (req, file, callback) => {
      callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
  }
});

const request_param = multer();
const uploadFile = multer({
  storage: Storage
});


//authentication
namedRouter.all('/proposal*', auth.authenticateAPI);

/**
 * @swagger
 * /proposal/submit:
 *   post:
 *     summary: Submit Proposal
 *     security:
 *       - Token: []
 *     tags:
 *       - Proposal
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: image
 *           type: file
 *           description: The image file to upload
 *         - name: body
 *           in: body
 *           description: Submit Proposal
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - rate
 *                 - estimated_days
 *                 - description
 *                 - job_id
 *             properties:
 *                 rate:
 *                     type: number
 *                 estimated_days:
 *                     type: number
 *                 description:
 *                     type: string
 *                 job_id:
 *                     type: string              
 *     responses:
 *        200:
 *          description: Proposal Saved successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

 namedRouter.post('api.proposal.submit', '/proposal/submit',uploadFile.any(), proposalController.saveProposal);


  /**
 * @swagger
 * /proposal/sent:
 *   get:
 *     summary: Get all Sent proposals
 *     security:
 *       - Token: []
 *     tags:
 *       - Proposal
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Proposal list fetched successfully.
 *        
 */
 namedRouter.get('api.proposal.sent', '/proposal/sent',uploadFile.any(), proposalController.mySentProposals);

/**
 * @swagger
 * /proposal/detail/{id}:
 *   get:
 *     summary: Proposal Detail
 *     security:
 *       - Token: []
 *     tags:
 *       - Proposal
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: Proposal id
 *                 
 *     responses:
 *        200:
 *          description: Proposal detail fetched successfully.
 *        
 */
 namedRouter.get('api.proposal.detail', '/proposal/detail/:id', request_param.any(), proposalController.proposalDetail);

 /**
 * @swagger
 * /proposal/status-change:
 *   post:
 *     summary: Proposal Status Change
 *     security:
 *       - Token: []
 *     tags:
 *       - Proposal
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: id
 *         type: string
 *         description: Proposal id
 *       - in: formData
 *         name: status
 *         type: string
 *         enum: ['Accepted', 'Rejected']
 *         description: Status
 *     responses:
 *        200:
 *          description: Proposal status updated successfully.
 *        
 */
 namedRouter.post('api.proposal.status.change', '/proposal/status-change', request_param.any(), proposalController.statusChange);



module.exports = router;