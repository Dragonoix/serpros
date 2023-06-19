const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const faqManagementController = require('faqManagement/controllers/faqManagement.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/faq-management")) {
			fs.mkdirSync("./public/uploads/faq-management");
		}
        callback(null, "./public/uploads/faq-management");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/faq-management*', auth.authenticate);

namedRouter.get("faq-management.list", '/faq-management/list', faqManagementController.list);

namedRouter.post("faq-management.getall", '/faq-management/getall', async (req, res) => {
	try {
		const success = await faqManagementController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("faq-management.create", '/faq-management/create', faqManagementController.create);
namedRouter.post("faq-management.insert", '/faq-management/insert', uploadFile.any(), faqManagementController.insert);
namedRouter.get("faq-management.edit", "/faq-management/edit/:id", faqManagementController.edit); 
namedRouter.post("faq-management.update", '/faq-management/update', uploadFile.any(), faqManagementController.update);
namedRouter.get("faq-management.delete", '/faq-management/delete/:id', faqManagementController.delete);    
namedRouter.get("faq-management.statusChange", '/faq-management/status-change/:id', request_param.any(), faqManagementController.statusChange);

// Export the express.Router() instance

module.exports = router;