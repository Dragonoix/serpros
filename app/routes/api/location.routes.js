const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const locationController = require('WEBSERVICES/location.controller');

const multer = require('multer');

const request_param = multer();







/**
 * @swagger
 * /location/regions:
 *   get:
 *     summary: Get all regions
 *     tags:
 *       - Location
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All regions fetched successfully.
 *        
 */
namedRouter.get('api.location.regions', '/location/regions',  locationController.getAllRegion);


/**
 * @swagger
 * /location/city:
 *   get:
 *     summary: Get all cities by region
 *     tags:
 *       - Location
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: region
 *         description: region id
 *         type: string
 *         required: true
 *                 
 *     responses:
 *        200:
 *          description: All cities fetched successfully.
 *        
 */

namedRouter.get('api.location.city', '/location/city',  locationController.getAllCityByRegion);



/**
 * @swagger
 * /location/suburb:
 *   get:
 *     summary: Get all suburbs by region and city
 *     tags:
 *       - Location
 *     produces:
 *       - application/json
 *     parameters: 
 *       - in: query
 *         name: region 
 *         type: string 
 *         description: Region Id 
 *       - in: query
 *         name: city 
 *         type: string
 *         description: City Id
 *     responses:
 *        200:
 *          description: All suburbs fetched successfully.
 *        
 */
namedRouter.get('api.location.suburb', '/location/suburb',  locationController.getAllSuburbByRegionCity);






module.exports = router;