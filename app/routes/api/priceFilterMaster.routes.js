const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const priceFilterMasterController = require('WEBSERVICES/priceFilterMaster.controller');

const multer = require('multer');
const request_param = multer();






/**
 * @swagger
 * /price-master/getall:
 *   get:
 *     summary: Get all PriceFilterMaster Request by User Id
 *     tags:
 *       - PriceFilterMaster
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All PriceFilterMaster fetched successfully.
 *        
 */


namedRouter.get('api.priceFilterMaster.getall', '/price-master/getall',  priceFilterMasterController.getAllPriceFilter);






module.exports = router;