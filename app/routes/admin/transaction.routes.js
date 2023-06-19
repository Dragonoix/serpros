const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const transactionController = require('transaction/controllers/transaction.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/transaction")) {
			fs.mkdirSync("./public/uploads/transaction");
		}
        callback(null, "./public/uploads/transaction");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 

namedRouter.all('/transaction*', auth.authenticate);

namedRouter.get("transaction.list", '/transaction/list', transactionController.list);

namedRouter.post("transaction.getall", '/transaction/getall', async (req, res) => {
	try {
		const success = await transactionController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});


namedRouter.get("transaction.detail", '/transaction/detail/:id', transactionController.detail);  
namedRouter.get("transaction.delete", '/transaction/delete/:id', transactionController.delete);    
namedRouter.get("transaction.statusChange", '/transaction/status-change/:id', request_param.any(), transactionController.statusChange);
// Export the express.Router() instance

module.exports = router;