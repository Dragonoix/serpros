const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const TestimonialController = require('testimonial/controllers/testimonial.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/testimonial")) {
			fs.mkdirSync("./public/uploads/testimonial");
		}
        callback(null, "./public/uploads/testimonial");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/testimonial*', auth.authenticate);

namedRouter.get("testimonial.list", '/testimonial/list', TestimonialController.list);

namedRouter.post("testimonial.getall", '/testimonial/getall', async (req, res) => {
	try {
		const success = await TestimonialController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("testimonial.create", '/testimonial/create', TestimonialController.create);
namedRouter.post("testimonial.insert", '/testimonial/insert', uploadFile.any(), TestimonialController.insert);
namedRouter.get("testimonial.edit", "/testimonial/edit/:id", TestimonialController.edit); 
namedRouter.post("testimonial.update", '/testimonial/update', uploadFile.any(), TestimonialController.update);
namedRouter.get("testimonial.delete", '/testimonial/delete/:id', TestimonialController.delete);    
namedRouter.get("testimonial.statusChange", '/testimonial/status-change/:id', request_param.any(), TestimonialController.statusChange);

// Export the express.Router() instance

module.exports = router;