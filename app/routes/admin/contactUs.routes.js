const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactUsController = require('contactUs/controllers/contactUs.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/contact-us")) {
			fs.mkdirSync("./public/uploads/contact-us");
		}
        callback(null, "./public/uploads/contact-us");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/contact-us*', auth.authenticate);

namedRouter.get("contact-us.list", '/contact-us/list', contactUsController.list);

namedRouter.post("contact-us.getall", '/contact-us/getall', async (req, res) => {
	try {
		const success = await contactUsController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

namedRouter.get("contact-us.detail", '/contact-us/detail/:id', contactUsController.detail);  

namedRouter.get("contact-us.delete", '/contact-us/delete/:id', contactUsController.delete);    
namedRouter.get("contact-us.statusChange", '/contact-us/status-change/:id', request_param.any(), contactUsController.statusChange);
// Export the express.Router() instance

module.exports = router;