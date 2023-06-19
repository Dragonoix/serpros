const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const footerCmsController = require('footerCms/controllers/footerCms.controller');

const multer = require('multer');
const request_param = multer();

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
            callback(null, "./public/uploads/footerCms")       
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

//authentication section of admin-footerCms
namedRouter.all('/footerCms*', auth.authenticate);

namedRouter.get("footerCms.edit", '/footerCms/edit', footerCmsController.edit);

namedRouter.post("footerCms.update", '/footerCms/update', uploadFile.any(), footerCmsController.update);



//Export the express.Router() instance
module.exports = router;