const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const cmsController = require('WEBSERVICES/cms.controller');

const multer = require('multer');

const request_param = multer();



/**
  * @swagger
  * /cms/details/{slug}:
  *   get:
  *     summary: Get CMS By Slug
  *     tags:
  *       - Cms
  *     produces:
  *       - application/json
  *     parameters:
  *      - name: slug
  *        in: path
  *        description: Get CMS By Slug
  *        enum: [terms_and_condition, privacy_policy, why-us, help-and-support, help-center, trust-and-safety]
  *        required: true
  *     responses:
  *       200:
  *         description: CMS Data Fetched Successfully
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/


// Get CMS Detail Route
namedRouter.get("api.cms.details", "/cms/details/:slug", cmsController.details);

/**
 * @swagger
 * /cms/homepage:
 *   get:
 *     summary: Get all Home Page Content
 *     tags:
 *       - Cms
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Home page content fetched successfully.
 *        
 */

namedRouter.get('api.cms.homepage', '/cms/homepage',  cmsController.getHomePageCms);


/**
 * @swagger
 * /cms/howitworks:
 *   get:
 *     summary: Get How it works Page Content
 *     tags:
 *       - Cms
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: How It Works content fetched successfully.
 *        
 */

namedRouter.get('api.cms.howitworks', '/cms/howitworks',  cmsController.howItWorksCms);


/**
 * @swagger
 * /cms/contactUsCms:
 *   get:
 *     summary: Get Contact Us Page Content
 *     tags:
 *       - Cms
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Contact Us content fetched successfully.
 *        
 */

namedRouter.get('api.cms.contactUsCms', '/cms/contactUsCms',  cmsController.contactUsCms);


/**
 * @swagger
 * /cms/footerCms:
 *   get:
 *     summary: Get Footer Content
 *     tags:
 *       - Cms
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Footer content fetched successfully.
 *        
 */

namedRouter.get('api.cms.footerCms', '/cms/footerCms',  cmsController.footerCms);






module.exports = router;