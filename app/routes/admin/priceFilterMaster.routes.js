const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const priceFilterMasterController = require('priceFilterMaster/controllers/priceFilterMaster.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/priceFilterMaster")) {
			fs.mkdirSync("./public/uploads/priceFilterMaster");
		}
        callback(null, "./public/uploads/priceFilterMaster");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/priceFilterMaster*', auth.authenticate);

namedRouter.get("priceFilterMaster.list", '/priceFilterMaster/list', priceFilterMasterController.list);

namedRouter.post("priceFilterMaster.getall", '/priceFilterMaster/getall', async (req, res) => {
	try {
		const success = await priceFilterMasterController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
        console.log(error);
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("priceFilterMaster.create", '/priceFilterMaster/create', priceFilterMasterController.create);
namedRouter.post("priceFilterMaster.insert", '/priceFilterMaster/insert', uploadFile.any(), priceFilterMasterController.insert);
namedRouter.get("priceFilterMaster.edit", "/priceFilterMaster/edit/:id", priceFilterMasterController.edit); 
namedRouter.post("priceFilterMaster.update", '/priceFilterMaster/update', uploadFile.any(), priceFilterMasterController.update);
namedRouter.get("priceFilterMaster.delete", '/priceFilterMaster/delete/:id', priceFilterMasterController.delete);    
namedRouter.get("priceFilterMaster.statusChange", '/priceFilterMaster/status-change/:id', request_param.any(), priceFilterMasterController.statusChange);

// Export the express.Router() instance

module.exports = router;