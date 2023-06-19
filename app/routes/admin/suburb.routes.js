const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const suburbController = require('suburb/controllers/suburb.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/suburb")) {
			fs.mkdirSync("./public/uploads/suburb");
		}
        callback(null, "./public/uploads/suburb");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/suburb*', auth.authenticate);

namedRouter.get("suburb.list", '/suburb/list', suburbController.list);

namedRouter.post("suburb.getall", '/suburb/getall', async (req, res) => {
	try {
		const success = await suburbController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
        console.log(error);
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("suburb.create", '/suburb/create', suburbController.create);
namedRouter.post("suburb.insert", '/suburb/insert', uploadFile.any(), suburbController.insert);
namedRouter.get("suburb.edit", "/suburb/edit/:id", suburbController.edit); 
namedRouter.post("suburb.update", '/suburb/update', uploadFile.any(), suburbController.update);
namedRouter.get("suburb.delete", '/suburb/delete/:id', suburbController.delete);    
namedRouter.get("suburb.statusChange", '/suburb/status-change/:id', request_param.any(), suburbController.statusChange);

// Export the express.Router() instance

module.exports = router;