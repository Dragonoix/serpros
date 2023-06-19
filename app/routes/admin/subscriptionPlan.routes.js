const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const subscriptionPlanController = require('subscriptionPlan/controllers/subscriptionPlan.controller');

const multer = require('multer');
const request_param = multer();

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
            callback(null, "./public/uploads/subscriptionPlan")       
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/svg+xml' && file.mimetype !=='image/webp') {
            req.fileValidationError = 'Only support jpeg, jpg or png file types.';
            return cb(null, false, new Error('Only support jpeg, jpg or png file types'));
        }
        cb(null, true);
    }
});

//authentication section of admin-subscriptionPlan
namedRouter.all('/subscriptionPlan*', auth.authenticate);

namedRouter.get("subscriptionPlan.edit", '/subscriptionPlan/edit', subscriptionPlanController.edit);

namedRouter.post("subscriptionPlan.update", '/subscriptionPlan/update', uploadFile.any(), subscriptionPlanController.update);



//Export the express.Router() instance
module.exports = router;