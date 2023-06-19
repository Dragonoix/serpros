const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const portfolioController = require('WEBSERVICES/portfolio.controller');

const multer = require('multer');
const request_param = multer();

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./public/uploads/portfolio")) {
            fs.mkdirSync("./public/uploads/portfolio");
        }
        callback(null, "./public/uploads/portfolio");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

namedRouter.all('/portfolio*', auth.authenticateAPI);

/**
 * @swagger
 * /portfolio/add-post:
 *   post:
 *     summary: Add User Portfolio Post
 *     tags:
 *       - Portfolio
 *     security:
 *       - Token: []
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         description: Choose Images
 *         items:
 *           type: file
 *       - in: formData
 *         name: text
 *         type: string
 *     responses:
 *        200:
 *          description: Portfolio post saved successfully.
 *        400:
 *          description: Something Went Wrong.
 *        500:
 *          description: Server Error.
 *        
 */

namedRouter.post('api.portfolio.add-post', '/portfolio/add-post', uploadFile.any(), portfolioController.add);



/**
 * @swagger
 * /portfolio/update/{id}:
 *   post:
 *     summary: Update User Portfolio
 *     tags:
 *       - Portfolio
 *     security:
 *       - Token: []
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *       - in: formData
 *         name: files
 *         type: array
 *         description: Choose Files
 *         items:
 *           type: file
 *       - in: formData
 *         name: del_image
 *         type: array
 *         description: Image file name
 *         items:
 *           type: string
 *       - in: formData
 *         name: text
 *         type: string
 *     responses:
 *        200:
 *          description: Portfolio Post saved successfully.
 *        400:
 *          description: Something Went Wrong.
 *        500:
 *          description: Server Error.
 *        
 */

namedRouter.post('api.portfolio.update', '/portfolio/update/:id', uploadFile.any(), portfolioController.update);


/**
 * @swagger
 * /portfolio/get:
 *   get:
 *     summary: Get all portfolio posts
 *     tags:
 *       - Portfolio
 *     security:
 *       - Token: []
 *     produces:
 *       - application/json          
 *     responses:
 *        200:
 *          description: All portfolio posts fetched successfully.
 *        
 */

namedRouter.get('api.portfolio.get', '/portfolio/get',  portfolioController.list);


/**
 * @swagger
 * /portfolio/details/{id}:
 *   get:
 *     summary: Get portfolio post details
 *     tags:
 *       - Portfolio
 *     security:
 *       - Token: []
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     produces:
 *       - application/json          
 *     responses:
 *        200:
 *          description: All portfolio details fetched successfully.
 *        
 */

namedRouter.get('api.portfolio.details', '/portfolio/details/:id',  portfolioController.details);


/**
 * @swagger
 * /portfolio/delete/{id}:
 *   get:
 *     summary: Delete Portfolio
 *     tags:
 *       - Portfolio
 *     security:
 *       - Token: []
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     produces:
 *       - application/json          
 *     responses:
 *        200:
 *          description: All portfolio delete fetched successfully.
 *        
 */

namedRouter.get('api.portfolio.delete', '/portfolio/delete/:id',  portfolioController.delete);


module.exports = router;