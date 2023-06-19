const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const categoryManagementController = require('categoryManagement/controllers/categoryManagement.controller');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
		if (!fs.existsSync("./public/uploads/category-management")) {
			fs.mkdirSync("./public/uploads/category-management");
		}
        callback(null, "./public/uploads/category-management");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});

const request_param = multer(); 






namedRouter.all('/category-management*', auth.authenticate);

namedRouter.get("category-management.list", '/category-management/list', categoryManagementController.list);

namedRouter.post("category-management.getall", '/category-management/getall', async (req, res) => {
	try {
		const success = await categoryManagementController.getAll(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status||500).send(error);
	}
});

namedRouter.get("category-management.create", '/category-management/create', categoryManagementController.create);
namedRouter.post("category-management.insert", '/category-management/insert', uploadFile.any(), categoryManagementController.insert);
namedRouter.get("category-management.edit", "/category-management/edit/:id", categoryManagementController.edit); 
namedRouter.post("category-management.update", '/category-management/update', uploadFile.any(), categoryManagementController.update);
namedRouter.get("category-management.delete", '/category-management/delete/:id', categoryManagementController.delete);    
namedRouter.get("category-management.statusChange", '/category-management/status-change/:id', request_param.any(), categoryManagementController.statusChange);
namedRouter.get("category-management.get-sub-category", '/category-management/get-sub-category/:id', request_param.any(), categoryManagementController.getSubCategory);


// Export the express.Router() instance

module.exports = router;