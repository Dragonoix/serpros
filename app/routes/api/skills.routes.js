const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const skillController = require('WEBSERVICES/skill.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /skill/getall:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Skill
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All categories fetched successfully.
 *        
 */


namedRouter.get('api.skill.getall', '/skill/getall',  skillController.getAllSkill);






module.exports = router;