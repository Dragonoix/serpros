const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const testimonialController = require('WEBSERVICES/testimonial.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /testimonial/getall:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Testimonial
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All categories fetched successfully.
 *        
 */


namedRouter.get('api.testimonial.getall', '/testimonial/getall',  testimonialController.getAllTestimonial);






module.exports = router;