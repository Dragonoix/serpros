const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const faqController = require('WEBSERVICES/faq.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /faq/getall:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Faq
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All categories fetched successfully.
 *        
 */


namedRouter.get('api.faq.getall', '/faq/getall',  faqController.getAllFaq);






module.exports = router;