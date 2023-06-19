const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactUsController = require('WEBSERVICES/contactUs.controller');
const config = require(appRoot + '/config/index');
const multer = require('multer');
const request_param = multer();


/**
 * @swagger
 * /contact-us/submit:
 *   post:
 *     summary: Sent Message
 *     tags:
 *       - Contact Us
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Sent Message
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - firstName
 *                 - lastName
 *                 - email
 *                 - phone
 *                 - message
 *             properties:
 *                 firstName:
 *                     type: string
 *                 lastName:
 *                     type: string
 *                 email:
 *                     type: string
 *                 phone:
 *                     type: string
 *                 message:
 *                     type: string
 *                 
 *     responses:
 *        200:
 *          description: Message Sent Successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 */

namedRouter.post('api.contact-us.submit', '/contact-us/submit', request_param.any(), contactUsController.submit);



module.exports = router;