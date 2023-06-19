const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const regionController = require('region/controllers/region.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/region")) {
			fs.mkdirSync("./public/uploads/region");
		}
        callback(null, "./public/uploads/region");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/region*', auth.authenticate);

namedRouter.get("region.list", '/region/list', regionController.list);

namedRouter.post("region.getall", '/region/getall', async (req, res) => {
	try {
		const success = await regionController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
        console.log(error);
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("region.create", '/region/create', regionController.create);
namedRouter.post("region.insert", '/region/insert', uploadFile.any(), regionController.insert);
namedRouter.get("region.edit", "/region/edit/:id", regionController.edit); 
namedRouter.post("region.update", '/region/update', uploadFile.any(), regionController.update);
namedRouter.get("region.delete", '/region/delete/:id', regionController.delete);    
namedRouter.get("region.statusChange", '/region/status-change/:id', request_param.any(), regionController.statusChange);

// Export the express.Router() instance

module.exports = router;