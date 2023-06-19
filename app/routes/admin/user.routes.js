const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const multer = require('multer');
const userController = require('user/controllers/user.controller');
const fs = require('fs');

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./public/uploads/user")) {
            fs.mkdirSync("./public/uploads/user");
        }
        if (!fs.existsSync("./public/uploads/user/profile_pic")) {
            fs.mkdirSync("./public/uploads/user/profile_pic");
        }
        callback(null, "./public/uploads/user/profile_pic");

    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});
const request_param = multer();

// 

// login render route
namedRouter.get('user.login', `/`, userController.login);

// login process route
namedRouter.post("user.login.process", '/admin/login', userController.signin);


/*
// @Route: Users Forgotpassowrd [Admin]
*/
namedRouter.post('admin.user.forgotPassword', '/user/forgotpassword', request_param.any(), userController.forgotPassword);

// revoke user access
namedRouter.get('user.revoke_access', "/revoke-access/:id/:access", userController.revokeUserAccess);

namedRouter.all('/*', auth.authenticate);

/*
// @Route: Users Dashboard [Admin]
*/
// dashboard route
namedRouter.get("user.dashboard", '/dashboard', userController.dashboard);

// admin logout
namedRouter.get('user.logout', "/logout", userController.logout);

// admin profile
namedRouter.get("admin.profile", '/profile/:id', request_param.any(), userController.viewmyprofile);

// admin update profile
namedRouter.post("admin.updateProfile", '/update/profile', uploadFile.any(), userController.updateAdminProfile);

// admin security
namedRouter.get("admin.security", '/security/:id', userController.security);

// User List
namedRouter.get("admin.user.listing", '/user/listing', userController.list);


// Get All Users
namedRouter.post("user.getall", '/user/getall', async (req, res) => {
    try {
        const success = await userController.getAllUser(req, res);
        res.send({
            "meta": success.meta,
            "data": success.data
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});


// User Insert
namedRouter.post("user.insert", '/user/insert', uploadFile.any(),userController.insert);

// User Delete Route
namedRouter.get("user.delete", "/user/delete/:id", userController.delete);

namedRouter.get("user.edit", "/user/edit/:id", userController.edit); 

// User Update Route
namedRouter.post("user.update", '/user/update', uploadFile.any(), userController.update);

// User View Route
namedRouter.get("admin.user.view", "/user/view/:id", userController.detail);

namedRouter.get("admin.user.security", "/user/security/:id", userController.userSecurity);

namedRouter.post("user.userUpdatePassword", "/user/password-update", request_param.any(), userController.userUpdatePassword);

// User Reset Password Route
namedRouter.get("user.resetPassword", "/user/reset-password/:id", userController.resetPassword);

/*
@Route: Chnage password [Admin] action
*/
namedRouter.post("admin.updateAdminPassword", '/update/admin-password', request_param.any(), userController.adminUpdatePassword);
namedRouter.get("user.statusChange", '/user/status-change/:id', request_param.any(), userController.statusChange);

namedRouter.get("user.create", '/user/create', userController.create);

namedRouter.post("user.insert", '/user/insert', uploadFile.any(), userController.insert);


// Export the express.Router() instance
module.exports = router;