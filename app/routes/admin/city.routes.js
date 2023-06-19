const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const cityController = require('city/controllers/city.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/city")) {
			fs.mkdirSync("./public/uploads/city");
		}
        callback(null, "./public/uploads/city");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/city*', auth.authenticate);

namedRouter.get("city.list", '/city/list', cityController.list);

namedRouter.post("city.getall", '/city/getall', async (req, res) => {
	try {
		const success = await cityController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
        console.log(error);
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("city.create", '/city/create', cityController.create);
namedRouter.post("city.insert", '/city/insert', uploadFile.any(), cityController.insert);
namedRouter.get("city.edit", "/city/edit/:id", cityController.edit); 
namedRouter.post("city.update", '/city/update', uploadFile.any(), cityController.update);
namedRouter.get("city.delete", '/city/delete/:id', cityController.delete);    
namedRouter.get("city.statusChange", '/city/status-change/:id', request_param.any(), cityController.statusChange);
namedRouter.get("city.get-all-cities", '/city/get-all-cities/:id', request_param.any(), cityController.getAllCities);


// Export the express.Router() instance

module.exports = router;