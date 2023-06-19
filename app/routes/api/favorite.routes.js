const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const favoriteController = require('WEBSERVICES/favorite.controller');

const multer = require('multer');


const request_param = multer();



// authentication
namedRouter.all('/favorite*', auth.authenticateAPI);

/**
 * @swagger
 * /favorite/list:
 *   get:
 *     summary: Get all favorite servicer.
 *     security:
 *       - Token: []
 *     tags:
 *       - Favorite
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Favorite page data fetched successfully.
 *        
 */


namedRouter.get("api.favorite.list", '/favorite/list', request_param.any(), async (req, res) => {
    try {
        const success = await favoriteController.FavoritePageData(req, res);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});


/**
 * @swagger
 * /favorite/add-remove:
 *   post:
 *     summary: Add to favorite
 *     security:
 *       - Token: []
 *     tags:
 *       - Favorite
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Add to favorite
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - servicer_id
 *             properties:
 *                 servicer_id:
 *                      type: string
 *                 
 *     responses:
 *        200:
 *          description: Added to favorite successfully.
 *        
 */

namedRouter.post("api.favorite.addRemove", '/favorite/add-remove', request_param.any(), async (req, res) => {
    try {
        const success = await favoriteController.addRemoveToFavorite(req, res);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});



module.exports = router;