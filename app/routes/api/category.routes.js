const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const categoryController = require('WEBSERVICES/category.controller');

const multer = require('multer');

const request_param = multer();



/**
 * @swagger
 * /category/getall:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All categories fetched successfully.
 *        
 */



namedRouter.get('api.category.getall', '/category/getall',  categoryController.getAllCategory);


/**
 * @swagger
 * /category/sub-category/{slug}:
 *   get:
 *     summary: Get all sub categories by category id
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: slug
 *           type: string
 *     responses:
 *        200:
 *          description: All sub categories fetched successfully.
 *        
 */
namedRouter.get('api.category.sub-category', '/category/sub-category/:slug',  categoryController.getSubCategoryByCategory);

namedRouter.get('api.category.sub-cat', '/category/sub-cat/:id',  categoryController.getSubCategoryById);


/**
 * @swagger
 * /category/breakdown:
 *   get:
 *     summary: Get all categories breakdown
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: All categories fetched successfully.
 *        
 */



namedRouter.get('api.category.breakdown', '/category/breakdown',  categoryController.categoryBreakdown);

/**
 * @swagger
 * /category/get-servicer:
 *   post:
 *     summary: Get all servicer 
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Get all servicer and category along with filter parameters
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - full_name
 *                 - location
 *                 - catId
 *                 - price
 *                 - rating
 *                 - city
 *                 - sort
 *             properties:
 *                 full_name:
 *                     type: string
 *                 location:
 *                     type: object
 *                     example: {lat: 0, lng: 0}
 *                 catId:
 *                     type: array
 *                     example: ["6347d2b110e3129d4bcd5746", "634904e289e61a2e73debd6b"]
 *                 price:
 *                     type: string
 *                     example: "63b4150d874bc64100c62911"
 *                 rating:
 *                     type: string
 *                     example: "3"
 *                 city:
 *                     type: array
 *                     example: ["Ahipara"]
 *                 sort:
 *                     type: string
 *                     example: "asc"
 *             
 *     responses:
 *        200:
 *          description: All servicer and category fetched successfully.
 *        
 */

namedRouter.post('api.category.get-servicer', '/category/get-servicer', categoryController.getServicer)


//////////////////////////// authentication starts ////////////////////////////////////
namedRouter.all('/category*', auth.authenticateAPI);


/**
 * @swagger
 * /category/servicer:
 *   post:
 *     summary: Get all servicer and category
 *     security:
 *       - Token: []
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Get all servicer and category along with filter parameters
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - full_name
 *                 - job_id
 *                 - location
 *                 - catId
 *                 - price
 *                 - rating
 *                 - city
 *                 - sort
 *             properties:
 *                 full_name:
 *                     type: string
 *                 job_id:
 *                     type: string
 *                 location:
 *                     type: object
 *                     example: {lat: 0, lng: 0}
 *                 catId:
 *                     type: array
 *                     example: ["6347d2b110e3129d4bcd5746", "634904e289e61a2e73debd6b"]
 *                 price:
 *                     type: string
 *                     example: "63b4150d874bc64100c62911"
 *                 rating:
 *                     type: string
 *                     example: "3"
 *                 city:
 *                     type: array
 *                     example: ["Ahipara"]
 *                 sort:
 *                     type: string
 *                     example: "asc"
 *             
 *     responses:
 *        200:
 *          description: All servicer and category fetched successfully.
 *        
 */
namedRouter.post('api.category.servicer', '/category/servicer', request_param.any(), categoryController.getServiceProviderByCategory);



/**
 * @swagger
 * /category/jobs/{slug}:
 *   post:
 *     summary: Get all jobs along with filter parameters
 *     security:
 *       - Token: []
 *     tags:
 *       - Category
 *     produces:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *           description: Category slug
 *         - name: body
 *           in: body
 *           description: Get all jobs along with filter parameters
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - title
 *                 - price
 *                 - city
 *             properties:
 *                 title:
 *                     type: string
 *                 price:
 *                     type: string
 *                     example: "63b4150d874bc64100c62911"
 *                 city:
 *                     type: array
 *                     example: ["Ahipara"]

 *             
 *     responses:
 *        200:
 *          description: Jobs fetched successfully.
 *        
 */
namedRouter.post('api.category.jobs', '/category/jobs/:slug', request_param.any(), categoryController.getJobsByCategory);




module.exports = router;