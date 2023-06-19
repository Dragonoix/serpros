const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const reviewController = require('review/controllers/review.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/review")) {
			fs.mkdirSync("./public/uploads/review");
		}
        callback(null, "./public/uploads/review");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/review*', auth.authenticate);

namedRouter.get("review.list", '/review/list', reviewController.list);

namedRouter.post("review.getall", '/review/getall', async (req, res) => {
	try {
		const success = await reviewController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});


namedRouter.get("review.detail", '/review/detail/:id', reviewController.detail);  
namedRouter.get("review.delete", '/review/delete/:id', reviewController.delete);    
namedRouter.get("review.statusChange", '/review/status-change/:id', request_param.any(), reviewController.statusChange);
// Export the express.Router() instance

module.exports = router;