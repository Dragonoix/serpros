const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const adminThemeController = require('adminThemeColor/controllers/adminThemeColor.controller');

const multer = require('multer');
const request_param = multer();

//authentication section of admin-theme-color
namedRouter.all('/theme-color*', auth.authenticate);

namedRouter.get("adminThemeColor.edit", '/theme-color/edit', adminThemeController.edit);

namedRouter.post("adminThemeColor.update", '/theme-color/update', request_param.any(), adminThemeController.update);



//Export the express.Router() instance
module.exports = router;