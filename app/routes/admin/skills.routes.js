const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const skillController = require('skills/controllers/skills.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/skill")) {
			fs.mkdirSync("./public/uploads/skill");
		}
        callback(null, "./public/uploads/skill");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/skill*', auth.authenticate);

namedRouter.get("skill.list", '/skill/list', skillController.list);

namedRouter.post("skill.getall", '/skill/getall', async (req, res) => {
	try {
		const success = await skillController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("skill.create", '/skill/create', skillController.create);
namedRouter.post("skill.insert", '/skill/insert', uploadFile.any(), skillController.insert);
namedRouter.get("skill.edit", "/skill/edit/:id", skillController.edit); 
namedRouter.post("skill.update", '/skill/update', uploadFile.any(), skillController.update);
namedRouter.get("skill.delete", '/skill/delete/:id', skillController.delete);    
namedRouter.get("skill.statusChange", '/skill/status-change/:id', request_param.any(), skillController.statusChange);

// Export the express.Router() instance

module.exports = router;