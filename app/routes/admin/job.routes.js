const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const jobController = require('job/controllers/job.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/job")) {
			fs.mkdirSync("./public/uploads/job");
		}
        callback(null, "./public/uploads/job");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/job*', auth.authenticate);

namedRouter.get("job.list", '/job/list', jobController.list);

namedRouter.post("job.getall", '/job/getall', async (req, res) => {
	try {
		const success = await jobController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
        console.log(error);
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("job.detail", '/job/detail/:id', jobController.detail); 
namedRouter.get("job.edit", "/job/edit/:id", jobController.edit); 
namedRouter.post("job.update", '/job/update', uploadFile.any(), jobController.update);
namedRouter.get("job.delete", '/job/delete/:id', jobController.delete);    
namedRouter.get("job.statusChange", '/job/status-change/:id', request_param.any(), jobController.statusChange);

// Export the express.Router() instance

module.exports = router;