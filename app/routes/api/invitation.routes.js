const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const invitationController = require('WEBSERVICES/invitation.controller');

const multer = require('multer');


const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/invitation")) {
      fs.mkdirSync("./public/uploads/invitation");
     }
        if(file.fieldname === 'image') {
          callback(null, "./public/uploads/invitation");
      }
      else {
        callback(null, "./public/uploads")
    }
  },
  filename: (req, file, callback) => {
      callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
  }
});

const uploadFile = multer({
  storage: Storage
});

//authentication
namedRouter.all('/invitation*', auth.authenticateAPI);

/**
 * @swagger
 * /invitation/send:
 *   post:
 *     summary: Send Invitation
 *     security:
 *       - Token: []
 *     tags:
 *       - Invitation
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Send Invitation
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - servicer_id
 *                 - job_id
 *             properties:
 *                 servicer_id:
 *                     type: string
 *                 job_id:
 *                     type: string              
 *     responses:
 *        200:
 *          description: Invitation Sent successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

 namedRouter.post('api.invitation.send', '/invitation/send',uploadFile.any(), invitationController.saveInvitation);


 /**
 * @swagger
 * /invitation/list:
 *   get:
 *     summary: Get all Invitations
 *     security:
 *       - Token: []
 *     tags:
 *       - Invitation
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Invitation list fetched successfully.
 *        
 */

 namedRouter.get('api.invitation.list', '/invitation/list',  invitationController.myInvitations);


  /**
 * @swagger
 * /invitation/dismiss/{id}:
 *   get:
 *     summary: Dismiss an Invitation
 *     security:
 *       - Token: []
 *     tags:
 *       - Invitation
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: _id of invitation to dismiss
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Invitation dismissed successfully.
 *        
 */

  namedRouter.get('api.invitation.dismiss', '/invitation/dismiss/:id',  invitationController.invitationDismiss);


module.exports = router;