const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const userRepo = require("user/repositories/user.repository");
const roleRepo = require("role/repositories/role.repository");
const portfolioRepo = require("portfolio/repositories/portfolio.repository");
const reviewRepo = require("review/repositories/review.repository");
const jobRepo = require("job/repositories/job.repository");
const mailer = require("../../helper/mailer.js");
const User = require('user/models/user.model');
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require('path');


class UserController {
    constructor() { }

    /**
     * @Method userSignup
     * @Description Signup For Users
     */

    async userSignup(req, res) {
        try {

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'company_logo') {
                            req.body.company_logo = req.files[i].filename;
                        }
                    }

                }
            }
            // console.log("BODY", req.body)
            // console.log("FILES",req.files)
            // if (!_.has(req.body, 'first_name') || ((_.has(req.body, 'first_name') && (_.isUndefined(req.body.first_name)) || _.isNull(req.body.first_name) || _.isEmpty(req.body.first_name.trim())))) {
            //     requestHandler.throwError(400, 'Bad Request', 'First name is required!')();
            // } else if (!_.has(req.body, 'last_name') || ((_.has(req.body, 'last_name') && (_.isUndefined(req.body.last_name)) || _.isNull(req.body.last_name) || _.isEmpty(req.body.last_name.trim())))) {
            //     requestHandler.throwError(400, 'Bad Request', 'Last name is required!')();
            // } else 
            if (!_.has(req.body, 'email') || ((_.has(req.body, 'email') && (_.isUndefined(req.body.email)) || _.isNull(req.body.email) || _.isEmpty(req.body.email.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
            } else if (!_.has(req.body, 'password') || ((_.has(req.body, 'password') && (_.isUndefined(req.body.password)) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Password is required!')();
            } else if (!_.has(req.body, 'user_type') || ((_.has(req.body, 'user_type') && (_.isUndefined(req.body.user_type)) || _.isNull(req.body.user_type) || _.isEmpty(req.body.user_type.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Please choose user type!')();
            } else if (!_.has(req.body, 'scope_type') || ((_.has(req.body, 'scope_type') && (_.isUndefined(req.body.scope_type)) || _.isNull(req.body.scope_type) || _.isEmpty(req.body.scope_type.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Please choose scope type!')();
            } else {
                if (req.body.user_type == "client") {
                    req.body.isPaymentCompleted = true;
                }
                req.body.email = req.body.email.trim().toLowerCase();
                req.body.first_name = req.body.first_name ? req.body.first_name.trim() : "";
                req.body.last_name = req.body.last_name ? req.body.last_name.trim() : "";
                req.body.full_name = req.body.first_name && req.body.last_name ? `${req.body.first_name} ${req.body.last_name}` : "";
                let userAvailable = await userRepo.getByField({ email: req.body.email, isDeleted: false });
                // console.log(req.body.email, userAvailable);
                if (!_.isEmpty(userAvailable)) {
                    requestHandler.throwError(403, 'Forbidden', 'Account already exist for this email!')();
                } else {
                    let userRole = await roleRepo.getByField({ role: 'user' });
                    req.body.role = userRole._id;
                    req.body.password = new User().generateHash(req.body.password);
                    let saveUser = await userRepo.save(req.body);
                    if (!_.isEmpty(saveUser) && saveUser._id) {
                        const payload = {
                            id: saveUser._id
                        };
                        let token = jwt.sign(payload, config.auth.jwtSecret, {
                            expiresIn: config.auth.jwt_expiresin
                        });
                        let userData = await userRepo.getUserDetails({ _id: saveUser._id });
                        if (userData.length > 0) {

                            if (userData[0].invoked_by == 'admin' && userData[0].createdAt.addDays(60) > new Date()) {  //check for invoded by admin and trial of 60 days
                                userData[0]["on_trial"] = true;
                            } else {
                                userData[0]["on_trial"] = false;
                            }
                            requestHandler.sendSuccess(res, 'Account has been created successfully')(userData[0], { token });

                        } else {
                            return requestHandler.throwError(400, 'Forbidden', 'Something went wrong')();
                        }

                    } else {
                        requestHandler.throwError(400, 'Bad Request', 'Something went wrong!')();
                    }
                }
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }


    /**
     * @Method login
     * @Description User Login
    */
    async login(req, res) {
        try {
            if (!_.has(req.body, 'email') || ((_.has(req.body, 'email') && (_.isUndefined(req.body.email)) || _.isNull(req.body.email) || _.isEmpty(req.body.email.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
            } else if (!_.has(req.body, 'password') || ((_.has(req.body, 'password') && (_.isUndefined(req.body.password)) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Password is required!')();
            } else {
                let userRole = await roleRepo.getByField({ role: 'user' });
                req.body.email = req.body.email.trim().toLowerCase();
                let userAvailable = await userRepo.getByField({ email: req.body.email, role: userRole._id, isDeleted: false });
                if (_.isEmpty(userAvailable)) {
                    requestHandler.throwError(403, 'Forbidden', 'No account found! Please proceed to signup')();
                } else if (userAvailable.status === 'Inactive') {
                    requestHandler.throwError(400, 'Forbidden', 'This account was set Inactive by the Admin')();
                } else if (userAvailable.isPaymentCompleted === false && new Date() > userAvailable.createdAt.addDays(60)) {
                    const payload = {
                        id: userAvailable._id
                    };

                    let token = jwt.sign(payload, config.auth.jwtSecret, {
                        expiresIn: config.auth.jwt_expiresin
                    });

                    requestHandler.sendSuccess(res, 'Please complete payment to activate your account.')({ isPaymentCompleted: false }, { token });
                } else {

                    let isPasswordMatched = new User().validPassword(req.body.password, userAvailable.password);
                    if (!isPasswordMatched) {
                        requestHandler.throwError(400, 'Forbidden', 'Authentication failed!')();
                    } else {
                        const payload = {
                            id: userAvailable._id
                        };

                        let token = jwt.sign(payload, config.auth.jwtSecret, {
                            expiresIn: config.auth.jwt_expiresin
                        });
                        await userRepo.updateById({ time_zone: req.body.time_zone }, userAvailable._id);
                        let userData = await userRepo.getUserDetails({ _id: userAvailable._id });
                        if (userData.length > 0) {

                            if (userData[0].invoked_by == 'admin' && userData[0].createdAt.addDays(60) > new Date()) { //check for invoded by admin and trial of 60 days
                                userData[0]["on_trial"] = true;
                            } else {
                                userData[0]["on_trial"] = false;
                            }
                            requestHandler.sendSuccess(res, 'Logged in successfully!')(userData[0], { token });

                        } else {
                            return requestHandler.throwError(400, 'Forbidden', 'Something went wrong')();
                        }
                    }
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


    /**
     * @Method userSocialSignup
     * @Description Signin using social media accounts
     */

    async userSocialSignup(req, res) {
        try {
            if (!_.has(req.body, 'first_name') || ((_.has(req.body, 'first_name') && (_.isUndefined(req.body.first_name)) || _.isNull(req.body.first_name) || _.isEmpty(req.body.first_name.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'First name is required!')();
            } else if (!_.has(req.body, 'last_name') || ((_.has(req.body, 'last_name') && (_.isUndefined(req.body.last_name)) || _.isNull(req.body.last_name) || _.isEmpty(req.body.last_name.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Last name is required!')();
            } else if (!_.has(req.body, 'registerType') || ((_.has(req.body, 'registerType') && (_.isUndefined(req.body.registerType)) || _.isNull(req.body.registerType) || _.isEmpty(req.body.registerType.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Register type is required!')();
            } else if (!_.has(req.body, 'socialId') || ((_.has(req.body, 'socialId') && (_.isUndefined(req.body.socialId)) || _.isNull(req.body.socialId) || _.isEmpty(req.body.socialId.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Social id is required!')();
            } else if (!_.has(req.body, 'user_type') || ((_.has(req.body, 'user_type') && (_.isUndefined(req.body.user_type)) || _.isNull(req.body.user_type) || _.isEmpty(req.body.user_type.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Please choose user type!')();
            } else if (!_.has(req.body, 'email') || ((_.has(req.body, 'email') && (_.isUndefined(req.body.email)) || _.isNull(req.body.email) || _.isEmpty(req.body.email.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
            } else {
                let filterParam = [];
                let socialObj = {};
                if (req.body.registerType == 'Facebook' || req.body.registerType == 'Google') {
                    socialObj['socialId'] = req.body.socialId;
                    socialObj['platform'] = req.body.registerType;
                    filterParam[0] = socialObj;
                } else {
                    return requestHandler.throwError(400, 'Bad Request', 'Please provide valid social account type!')();
                }
                req.body.email = req.body.email.trim().toLowerCase();
                let emailExists = await userRepo.getByField({ email: req.body.email, isDeleted: false, socialAccount: { $not: { $elemMatch: socialObj } } });
                if (!_.isEmpty(emailExists)) {
                    requestHandler.throwError(403, 'Forbidden', 'Account already exist for this email in another method!')();
                } else {
                    let userAvailable = await userRepo.getByField({ isDeleted: false, socialAccount: { $elemMatch: socialObj } });
                    if (!_.isEmpty(userAvailable) && userAvailable._id) {
                        if (userAvailable.status === 'Inactive') {
                            requestHandler.throwError(400, 'Forbidden', 'This account was set Inactive by the Admin')();
                        } else {
                            if (!_.isEmpty(req.body.deviceToken) && !_.isEmpty(req.body.deviceType)) {
                                userRepo.updateById({ deviceType: req.body.deviceType, deviceToken: req.body.deviceToken });
                            }
                            const payload = { id: userAvailable._id };
                            let token = jwt.sign(payload, config.auth.jwtSecret, { expiresIn: config.auth.jwt_expiresin });

                            let userDetails = await userRepo.getUserDetails({ _id: userAvailable._id });
                            requestHandler.sendSuccess(res, "Logged in successfully.")(userDetails[0], { token });
                        }
                    } else {
                        let userRole = await roleRepo.getByField({ role: 'user' });
                        req.body.role = userRole._id;
                        if (req.body.password) delete req.body.password;
                        req.body.registrationCompleted = true;
                        req.body.socialAccount = socialObj;
                        let addUser = await userRepo.save(req.body);
                        if (!_.isEmpty(addUser) && addUser._id) {

                            const payload = { id: addUser._id };
                            let token = jwt.sign(payload, config.auth.jwtSecret, { expiresIn: config.auth.jwt_expiresin });

                            let userData = await userRepo.getUserDetails({ _id: addUser._id });
                            requestHandler.sendSuccess(res, 'Successfully Registered! Welcome Onboard.!')(userData[0], { token });
                        } else {
                            requestHandler.throwError(400, 'Bad Request', 'Something went wrong!')();
                        }
                    }
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);

        }
    }




    /**
     * @Method updateProfile
     * @Description Update User Profile Data
     */

    async updateProfile(req, res) {
        try {
            console.log("profile update body: ", req.body);
            let userData = await userRepo.getByField({ _id: req.user._id, isDeleted: false });
            if (!_.isEmpty(userData) && userData._id) {
                if (req.body.role) delete req.body.role;
                if (req.body.password) delete req.body.password;
                if (req.body.deviceToken) delete req.body.deviceToken;
                if (req.body.deviceType) delete req.body.deviceType;
                if (req.body.isDeleted) delete req.body.isDeleted;
                if (req.body.status) delete req.body.status;

                if (!_.isEmpty(req.files) && req.files.length > 0) {
                    req.files.map(data => {
                        if (data.fieldname === 'profile_image') {
                            req.body.profile_image = data.filename;
                            if (!_.isEmpty(userData) && !_.isEmpty(userData.profile_image) && fs.existsSync("./public/uploads/user/profile_pic/" + userData.profile_image)) {
                                fs.unlinkSync("./public/uploads/user/profile_pic/" + userData.profile_image);
                            }
                        } else if (data.fieldname === 'cover_image') {
                            req.body.cover_image = data.filename;
                            if (!_.isEmpty(userData) && !_.isEmpty(userData.cover_image) && fs.existsSync("./public/uploads/user/cover_pic/" + userData.cover_image)) {
                                fs.unlinkSync("./public/uploads/user/cover_pic/" + userData.cover_image);
                            }
                        } else {
                            req.body[data.fieldname] = data.filename;
                        }
                    })
                }
                if (_.has(req.body, 'email')) {
                    if (!_.isEmpty(req.body.email.trim())) {
                        req.body.email = req.body.email.trim().toLowerCase();
                        let checkEmail = await userRepo.getByField({ isDeleted: false, email: req.body.email, _id: { $ne: mongoose.Types.ObjectId(req.user._id) } });
                        if (!_.isEmpty(checkEmail)) {
                            return requestHandler.throwError(400, 'Bad Request', 'The email Id is already registered.')();
                        };
                    } else {
                        return requestHandler.throwError(400, 'Bad Request', 'The email can not be empty')();
                    }
                }
                if (_.has(req.body, 'phone')) {
                    let checkPhone = await userRepo.getByField({ isDeleted: false, phone: req.body.phone, _id: { $ne: mongoose.Types.ObjectId(req.user._id) } });
                    if (!_.isEmpty(checkPhone)) {
                        return requestHandler.throwError(400, 'Bad Request', 'The phone number is already registered.')();
                    };
                }
                // console.log("body: ",req.body);
                let updateUser = await userRepo.updateById(req.body, req.user._id);

                if (!_.isEmpty(updateUser) && updateUser._id) {
                    let userData = await userRepo.getUserDetails({ _id: updateUser._id });
                    if (userData.length > 0) {

                        //Activity record function
                        utils.saveUserActivity({
                            userId: userData[0]._id,
                            title: 'Profile Updated.',
                            description: 'Your profile was updated successfully.',
                        });

                        requestHandler.sendSuccess(res, 'Profile updated successfully')(userData[0]);

                    } else {
                        requestHandler.throwError(400, 'Forbidden', 'Something went wrong!')();
                    }

                } else {
                    requestHandler.throwError(400, 'Forbidden', 'Something went wrong!')();
                }
            } else {
                requestHandler.throwError(403, 'Bad Request', 'Oops, no user found. Kindly proceed to signup')();
            }
        } catch (error) {
            console.log("profile update: ", error.message);
            return requestHandler.sendError(req, res, error);

        }
    }



    /* @Method: ProfileDetails
    // @Description: View Profile Details for dashboard 
    */
    async profileDetails(req, res) {
        try {
            let payload = {};
            let userData = await userRepo.getUser(mongoose.Types.ObjectId(req.user._id));
            let portfolioData = await portfolioRepo.getPostsByUser(req.user._id);
            let reviewData = await reviewRepo.getAllReview(req.user._id);
            let jobData = await jobRepo.getAllByField({ user_id: req.user._id, isDeleted: false, status: "Active", });

            payload = { ...userData._doc, portfolioData: portfolioData, reviewData: reviewData, jobs: jobData, project_count: 10, successfull_projects: 9 };

            if (userData.invoked_by == 'admin' && userData.createdAt.addDays(60) > new Date() && userData.isPaymentCompleted != true) {
                payload['on_trial'] = true;
            } else {
                payload['on_trial'] = false;
            }
            if (userData.skills.length == 0 && userData.rate_per_hr == 0) {
                payload['is_profile_completed'] = false;
            } else {
                payload['is_profile_completed'] = true;
            }
            if (!_.isEmpty(payload)) {
                return requestHandler.sendSuccess(res, 'Profile details fetched successfully.')(payload);
            } else {
                return requestHandler.throwError(400, 'Bad Request', 'No record found')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async userChangePassword(req, res) {
        try {
            if (!_.has(req.body, 'old_password') || (_.has(req.body, 'old_password') && (_.isUndefined(req.body.old_password) || _.isNull(req.body.old_password) || _.isEmpty(req.body.old_password.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Old password is required')();
            }

            if (!_.has(req.body, 'password') || (_.has(req.body, 'password') && (_.isUndefined(req.body.password) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Password is required')();
            }

            let user = await userRepo.getById(req.user._id);

            if (!_.isEmpty(user)) {
                if (!user.validPassword(req.body.old_password, user.password)) {
                    return requestHandler.throwError(400, 'Bad Request', 'Sorry old password mismatched')();
                } else {

                    if (req.body.password != req.body.old_password) {

                        let new_password = new User().generateHash(req.body.password);
                        let userUpdate = await userRepo.updateById({ "password": new_password }, user._id);

                        if (userUpdate && userUpdate._id) {
                            //Activity record function
                            utils.saveUserActivity({
                                userId: userUpdate._id,
                                title: 'Password Changed',
                                description: 'Your password has been changed successfully.',
                            });

                            return requestHandler.sendSuccess(res, 'Your password has been changed successfully.')();
                        } else {
                            return requestHandler.throwError(400, 'Bad Request', 'Failed to update password')();
                        }
                    } else {
                        return requestHandler.throwError(400, 'Bad Request', 'Your New Password And Old Password should not match.')();
                    }
                }
            } else {
                return requestHandler.throwError(400, 'Bad Request', 'Something went wrong! No user found.')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async getAllServiceProvider(req, res) {
        try {

            let user = await userRepo.getAllByField({ "isDeleted": false, "status": "Active", "user_type": "service_provider" });
            requestHandler.sendSuccess(res, 'Service provider listing fetched successfully.')(user);

        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }

    async UpdateAvailability(req, res) {
        try {

            var data = await userRepo.updateById({ availability: req.body.availability }, req.user._id);
            if (!_.isEmpty(data)) {
                requestHandler.sendSuccess(res, 'Availability updated successfully.')(data);
            } else {
                requestHandler.throwError(400, 'Bad Request', "Update failed")();
            }

        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }

    /**
         * @Method logout
         * @Description User Logout
    */

    async logout(req, res) {
        try {
            const token = req.headers['token'];
            requestHandler.sendSuccess(res, 'Logged out successfully')(null);
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async portfolio(req, res) {
        try {
            var userId = req.params.id;

            if (!mongoose.isValidObjectId(userId)) {
                return requestHandler.throwError(400, 'Bad Request', "Invalid user id ")();
            }


            let userPorfolio = await userRepo.getPortfolio(userId);

            if (!_.isEmpty(userPorfolio)) {
                requestHandler.sendSuccess(res, 'User portfolio fetched successfully')(userPorfolio);
            } else {
                requestHandler.throwError(400, 'Bad Request', "Update failed")();
            }

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


};


Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};


module.exports = new UserController();
