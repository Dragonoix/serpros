const mongoose = require('mongoose');
const User = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');
const userActivityTimelinesRepo = require('userActivityTimelines/repositories/userActivityTimelines.repository');
const userDevicesRepo = require('user_devices/repositories/user_devices.repository');
const testimonialRepo = require('testimonial/repositories/testimonial.repository')
const jobRepo = require('job/repositories/job.repository');
const transactionRepo = require('transaction/repositories/transaction.repository');
const reviewRepo = require('review/repositories/review.repository');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const otp = require('otp-generator');
const libPhoneNumber = require('libphonenumber-js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
userDevicesRepo.bulkDelete({ isDeleted: false });

const mailer = require("../../../helper/mailer");

class UserController {
    constructor() {
        this.users = [];
    }

    /**
     * @Method login
     * @Description Render Login Page For Admin Panel
    */
    async login(req, res) {
        try {
            if (req.session && req.session.token) {
                res.redirect(namedRouter.urlFor('user.dashboard'));
            } else {
                res.render('user/views/login');
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Method signin
     * @Description User Login
    */
    async signin(req, res) {
        try {
            req.body.email = req.body.email.trim().toLowerCase();
            let roles = await roleRepo.getDistinctDocument('_id', { rolegroup: "backend", isDeleted: false });
            req.body.roles = roles;
            let userData = await userRepo.fineOneWithRole(req.body);
            if (userData.status == 500) {
                req.flash('error', userData.message);
                return res.redirect(namedRouter.urlFor('user.login'));
            }
            let user = userData.data;
            if (user.status == 'Inactive') {
                req.flash('error', "Account was set inactive by the Administrator");
                return res.redirect(namedRouter.urlFor('user.login'));
            } else
                if (user.status == 'Banned') {
                    req.flash('error', "Account was Banned by the Administrator");
                    return res.redirect(namedRouter.urlFor('user.login'));
                } else
                    if (!_.isEmpty(user.role)) {
                        const payload = {
                            id: user._id
                        };

                        let token = jwt.sign(payload, config.auth.jwtSecret, {
                            expiresIn: config.auth.jwt_expiresin.toString() // token expiration time
                        });

                        req.session.token = token;
                        req.user = user;

                        req.flash('success', "You have successfully logged in");
                        return res.redirect(namedRouter.urlFor('user.dashboard'));
                    } else {
                        req.flash('error', 'Authentication failed. You are not a valid user.');
                        return res.redirect(namedRouter.urlFor('user.login'));
                    }
        } catch (err) {
            req.flash('error', 'Something went wrong!');
            return res.redirect(namedRouter.urlFor('user.login'));
            // throw err;
        }
    };

    /**
     * @Method insert
     * @Description Save User Data
    */
    async insert(req, res) {
        try {

            if (_.isEmpty(req.body.full_name)) {
                req.flash('error', 'Full Name Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('user.create'));
                return;
            } else {
                req.body.first_name = req.body.full_name.split(" ")[0];
                req.body.last_name = req.body.full_name.split(" ")[1];
            }

            if (_.isEmpty(req.body.email)) {
                req.flash('error', 'Email Should Not Be Empty!');
                res.redirect(namedRouter.urlFor('user.create'));
                return;
            }

            if (_.isEmpty(req.body.user_type)) {
                req.flash('error', 'User type must be selected!');
                res.redirect(namedRouter.urlFor('user.create'));
                return;
            }

            let roleDetails = await roleRepo.getByField({ role: "user" });
            if (!_.isEmpty(roleDetails)) {
                req.body.role = roleDetails._id;
            }
            const newUser = new User();
            let random_pass = Math.random().toString(36).substr(2, 9);
            const readable_pass = random_pass;
            random_pass = newUser.generateHash(random_pass);
            req.body.email = req.body.email.trim().toLowerCase();
            req.body.password = random_pass;

            var chk = { isDeleted: false, email: req.body.email };
            let checkEmail = await userRepo.getByField(chk);
            if (!_.isEmpty(checkEmail)) {
                req.flash('error', "Sorry, account already exist with this email.");
                res.redirect(namedRouter.urlFor('admin.user.listing'));
            } else {
                if (req.files && req.files.length) {
                    for (let file of req.files) {
                        req.body[file.fieldname] = file.filename;
                    }
                }
                
                if (req.body.user_type == 'service_provider') {
                    req.body.isPaymentCompleted = true;
                }
                
                req.body.invoked_by = 'admin';

                let saveUser = await userRepo.save(req.body);
                if (_.isObject(saveUser) && saveUser._id) {
                    utils.saveUserActivity({
                        userId: saveUser._id,
                        title: 'Account Created!',
                        description: (req.user.full_name ? req.user.full_name : req.user.first_name + ' ' + req.user.last_name) + ' has created User account.',
                    });
                   
                    // await mailer.sendMail(`${project_name} Admin<${config.sendgrid.from_email}>`, saveUser.email, `Registration Successful || ${project_name}`, 'admin-user-registration', emailData);
                    await mailer.sendMailViaGmail(req.body.email, 'Serpros || Login Credentials', 'login-creds', {
                        fullName: req.body.full_name, 
                        email: req.body.email,
                        password: readable_pass
                    });
                    req.flash('success', 'Account created successfully');
                    res.redirect(namedRouter.urlFor('admin.user.listing'));
                } else {
                    req.flash('error', "Failed to create new account");
                    res.redirect(namedRouter.urlFor('admin.user.listing'));
                }
            }
        } catch (err) {
            req.flash('error', err.message);
            res.redirect(namedRouter.urlFor('admin.user.listing'));
            // throw err;
        }
    };

    /**
     * @Method list
     * @Description To Get All User's Details From DB
    */
    async list(req, res) {
        try {
            let status = '';
            if (req.query.status) {
                status = req.query.status;
            }

            let userRole = await roleRepo.getByField({ role: "user" });
            let totalUsers = await userRepo.getUserCountByParam({ isDeleted: false, role: userRole._id });
            let recentUsers = await userRepo.getUserCountByParam({ isDeleted: false, createdAt: { $gte: new Date(moment().subtract(24, 'hours').format()) }, role: userRole._id });
            let activeUsers = await userRepo.getUserCountByParam({ isDeleted: false, status: 'Active', role: userRole._id });
            // let bannedUsers = await userRepo.getUserCountByParam({ isDeleted: false, status: 'Banned', role: userRole._id });
            res.render('user/views/list.ejs', {
                page_name: 'user-management',
                page_title: 'User List',
                user: req.user,
                status,
                stats: {
                    totalUsers,
                    recentUsers,
                    activeUsers,
                    // bannedUsers
                }
            });
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    };


    /**
     * @Method getAllUser
     * @Description To Get All The Users From The DB
    */
    async getAllUser(req, res) {
        try {
            let start = parseInt(req.body.start);
            let length = parseInt(req.body.length);
            let currentPage = 1;
            if (start > 0) {
                currentPage = parseInt((start + length) / length);
            }
            req.body.page = currentPage;
            req.body.role = 'user';
            let user = await userRepo.getAllUsers(req);
            let data = {
                "recordsTotal": user.total,
                "recordsFiltered": user.total,
                "data": user.docs
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            };
        } catch (err) {
            return {
                status: 500,
                data: [],
                message: err.message
            };
        }
    }

    /**
     * @Method detail
     * @Description To Get User Account Details Information
    */
    async detail(req, res) {
        try {
            let details = await userRepo.getById(mongoose.Types.ObjectId(req.params.id));
            if (!_.isEmpty(details)) {
                let activities = await userActivityTimelinesRepo.getAllByFieldWithSortAndLimit({ userId: details._id, isDeleted: false }, { createdAt: -1 }, 10);
                res.render('user/views/user-account.ejs', {
                    page_name: 'user-management',
                    page_title: 'Account',
                    user: req.user,
                    response: details,
                    activities: activities ? activities : []
                });
            } else {
                req.flash('error', "Sorry User not found!");
                res.redirect(namedRouter.urlFor('admin.user.listing'));
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Method userSecurity
     * @Description To Get The User Security Information
    */
    async userSecurity(req, res) {
        try {
            let details = await userRepo.getByIdWithUserDevices(mongoose.Types.ObjectId(req.params.id));
            if (!_.isEmpty(details)) {
                res.render('user/views/user-security.ejs', {
                    page_name: 'user-management',
                    page_title: 'Security',
                    user: req.user,
                    response: details
                });
            } else {
                req.flash('error', "Sorry User not found!");
                res.redirect(namedRouter.urlFor('admin.user.listing'));
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Method resetPassword
     * @Description User's Reset Password
    */
    async resetPassword(req, res) {
        try {
            let user = await userRepo.getById(req.params.id);
            if (user) {
                let random_pass = utils.betweenRandomNumber(10000000, 99999999)
                let readable_pass = random_pass;
                random_pass = new User().generateHash(random_pass);
                let userUpdate = await userRepo.updateById({
                    "password": random_pass
                }, user._id);
                if (!userUpdate) {
                    req.flash('error', 'Account Not Found.');
                    res.redirect(namedRouter.urlFor('admin.user.listing'));
                } else {
                    utils.saveUserActivity({
                        userId: userUpdate._id,
                        title: 'Account Password Reset!',
                        description: (req.user.full_name ? req.user.full_name : req.user.first_name + ' ' + req.user.last_name) + ' has reset User account password.',
                    });
                    let emailData = { name: user.fullName, password: readable_pass };
                    await mailHelper.sendMail(`${project_name} Admin<${config.sendgrid.from_email}>`, user.email, `Reset Password || ${project_name}`, 'admin-user-change-password', emailData);
                    req.flash('success', 'User will receive a new password via email.');
                    res.redirect(namedRouter.urlFor('admin.user.view', { id: user._id }));
                }
            } else {
                req.flash('error', 'Account not found.');
                res.redirect(namedRouter.urlFor('admin.user.listing'));
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    };

    /**
     * @Method delete
     * @Description User Delete
    */
    async delete(req, res) {
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id);
            if (!_.isEmpty(userDelete) && userDelete._id) {
                utils.deleteUserActivity({ userId: userDelete._id });
                req.flash('success', 'Account Deleted Successfully');
                /* We are remove profile image after delete the user, because that user's image no more need and also increase the memory on server*/
                if (userDelete.profile_image) {
                    if (fs.existsSync('./public/uploads/user/profile_pic/' + userDelete.profile_image)) {
                        fs.unlinkSync('./public/uploads/user/profile_pic/' + userDelete.profile_image);
                    }
                }
            } else {
                req.flash('error', 'Failed to delete account');
            }
            res.redirect(namedRouter.urlFor('admin.user.listing'));
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    };

    /**
     * @Method statusChange
     * @Description Change The Status Of User
    */
    async statusChange(req, res) {
        try {
            let userInfo = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userInfo)) {
                let userStatus = req.query.status;
                let userUpdate = await userRepo.updateById({ status: userStatus }, req.params.id);
                if (!_.isEmpty(userUpdate) && userUpdate._id) {
                    utils.saveUserActivity({
                        userId: userUpdate._id,
                        title: 'Account Status Changed!',
                        description: (req.user.full_name ? req.user.full_name : req.user.first_name + ' ' + req.user.last_name) + ' has changed account status from <b>"' + userInfo.status + '"</b> to <b>"' + userStatus + '"</b>.',
                    });
                    req.flash("success", "Account Status Has Been Changed Successfully");
                } else {
                    req.flash('error', "Something went wrong!");
                }
                if (req.query.path) {
                    res.redirect(req.query.path);
                } else {
                    res.redirect(namedRouter.urlFor('admin.user.listing'));
                }
            } else {
                req.flash("error", "Account status has not been changed successfully");
                res.redirect(namedRouter.urlFor("admin.user.listing"));
            }
        } catch (err) {
            throw err;
        }
    };

    /**
     * @Method userUpdatePassword
     * @Description To Update The User's Password
    */
    async userUpdatePassword(req, res) {
        try {
            let user = await userRepo.getById(req.body.id);
            if (user && user._id) {
                let new_password = new User().generateHash(req.body.password);
                let userUpdate = await userRepo.updateById({
                    "password": new_password
                }, user._id);

                if (userUpdate && userUpdate._id) {
                    utils.saveUserActivity({
                        userId: userUpdate._id,
                        title: 'Account Password Changed!',
                        description: (req.user.full_name ? req.user.full_name : req.user.first_name + ' ' + req.user.last_name) + ' has changed account password.',
                    });
                    let emailData = { name: user.fullName, password: req.body.password };
                    await mailHelper.sendMail(`${project_name} Admin<${config.sendgrid.from_email}>`, user.email, `Change Password || ${project_name}`, 'admin-user-change-password', emailData);
                    req.flash('success', "Account password has been changed successfully.");
                } else {
                    req.flash('error', "Failed to update password.");
                }
                res.redirect(namedRouter.urlFor('admin.user.security', { id: user._id }));
            } else {
                req.flash('error', "Something went wrong! No account found.");
                res.redirect(namedRouter.urlFor('admin.user.listing'));
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    };

    /**
     * @Method dashboard
     * @Description To Render The User Dashboard
    */
    async dashboard(req, res) {
        try {
            /* Html render here */
            let userRole = await roleRepo.getByField({ role: "user" });
            let totalUsers = await userRepo.getUserCountByParam({ isDeleted: false, role: userRole._id });
            let totalTestimonial = await testimonialRepo.getTestimonialCountByParam({ isDeleted: false, status: 'Active' });
            let activeUsers = await userRepo.getUserCountByParam({ isDeleted: false, status: 'Active', role: userRole._id });
            let inActiveUsers = await userRepo.getUserCountByParam({ isDeleted: false, status: 'Inactive', role: userRole._id });

            let totServices = await jobRepo.getDocumentCount({ isDeleted: false });
            let activeServices = await jobRepo.getDocumentCount({ isDeleted: false, status: 'Active' });
            let inactiveServices = await jobRepo.getDocumentCount({ isDeleted: false, status: 'Inactive' });

            let revenueGen = await transactionRepo.getRevenue();

            let avgRating = await reviewRepo.getOverallRating();

            res.render('user/views/dashboard', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                totalUsers,
                activeUsers,
                inActiveUsers,
                totServices,
                activeServices,
                inactiveServices,
                revenueGen,
                avgRating,
                totalTestimonial
            });

        } catch (err) {
            console.log(err.message);
            return res.status(500).send({ message: err.message });
        }
    };

    /**
     * @Method logout
     * @Method User Logout
    */
    async logout(req, res) {
        try {
            if (req.session.token) {
                let findDevice = await userDevicesRepo.getByField({ access_token: req.session.token, isDeleted: false, userId: req.user._id });
                if (findDevice) {
                    await userDevicesRepo.delete(findDevice._id);
                }
            }

            req.session.destroy(function (err) {
                res.redirect('/');
            });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    };

    /**
     * @Method viewmyprofile
     * @Description To Get Admin Profile Information From DB
    */
    async viewmyprofile(req, res) {
        try {
            const id = req.params.id;
            let user = await userRepo.getById(id);
            if (!_.isEmpty(user)) {
                res.render('user/views/admin-account.ejs', {
                    page_name: 'admin-settings',
                    page_title: 'Account',
                    user: req.user,
                    response: user
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    }

    /**
     * @Method security
     * @Description To Get Admin Profile Security Information From DB
    */
    async security(req, res) {
        try {
            const id = req.params.id;
            let user = await userRepo.getByIdWithUserDevices(id);
            if (!_.isEmpty(user)) {
                res.render('user/views/admin-security.ejs', {
                    page_name: 'admin-security',
                    page_title: 'Security',
                    user: req.user,
                    response: user,
                    current_token: req.session.token
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    }

    /**
     * @Method revokeUserAccess
     * @Description To Remove Any User Access From DB
    */
    async revokeUserAccess(req, res) {
        try {
            let access_id = mongoose.Types.ObjectId(req.params.access);
            await userDevicesRepo.updateById({ 'expired': true }, access_id);

            req.flash('success', "Account Access Revoked Successfully.");
            if (req.query.path) {
                res.redirect(req.query.path);
            } else {
                res.redirect(namedRouter.urlFor('user.dashboard'));
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    }

    /**
     * @Method edit
     * @Description To Show The Edit Form
    */
    async edit(req, res) {
        try {
            let userData = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userData)) {
                res.render('user/views/edit', {
                    page_name: 'admin-settings',
                    page_title: 'User Edit',
                    user: req.user,
                    response: userData,
                })
            } else {
                req.flash('error', 'User Not Found!');
                res.redirect(namedRouter.urlFor('admin.user.listing'));

            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * @Method update
     * @Description Update User Information Action
     */
    async update(req, res) {
        try {
            req.body.email = req.body.email.trim().toLowerCase();
            let chkEmail = {
                isDeleted: false,
                email: { $regex: '^' + req.body.email + '$', $options: 'i' },
                _id: { $ne: mongoose.Types.ObjectId(req.body.id) }
            };
            let checkEmail = await userRepo.getByField(chkEmail);
            if (!_.isEmpty(checkEmail)) {
                req.flash('error', "Email already used for another account.");
                res.redirect(namedRouter.urlFor('admin.user.view', {
                    id: req.body.id
                }));
            } else {
                let accountDetails = await userRepo.getById(req.body.id);
                if (req.files && req.files.length) {
                    for (let file of req.files) {
                        if (accountDetails && accountDetails[file.fieldname] && fs.existsSync('./public/uploads/user/profile_pic/' + accountDetails[file.fieldname])) {
                            fs.unlinkSync('./public/uploads/user/profile_pic/' + accountDetails[file.fieldname]);
                        }
                        req.body[file.fieldname] = file.filename;
                    }
                }
                let userUpdate = await userRepo.updateById(req.body, mongoose.Types.ObjectId(req.body.id));
                if (_.isObject(userUpdate) && userUpdate._id) {
                    utils.saveUserActivity({
                        userId: userUpdate._id,
                        title: 'Account Updated!',
                        description: (req.user.full_name ? req.user.full_name : req.user.first_name + ' ' + req.user.last_name) + ' has updated User account.',
                    });
                    req.flash('success', 'User updated successfully.');
                    res.redirect(namedRouter.urlFor('admin.user.listing', {
                        id: req.body.id
                    }));

                } else {
                    req.flash('error', 'Failed to update User account.');
                    res.redirect(namedRouter.urlFor('admin.user.listing', {
                        id: req.body.id
                    }));
                }
            }
        } catch (err) {
            req.flash('error', err.message);
            res.redirect(namedRouter.urlFor('admin.user.listing', {
                id: req.body.id
            }));
        }
    };

    /**
     * @Method updateAdminProfile
     * @Description Update Admin Profile 
    */
    async updateAdminProfile(req, res) {
        try {
            const id = mongoose.Types.ObjectId(req.body.id);
            req.body.email = req.body.email.trim().toLowerCase();
            let userAvail = await userRepo.getByField({ email: { $regex: '^' + req.body.email.trim() + '$', $options: 'i' }, _id: { $ne: id }, isDeleted: false });
            if (userAvail) {
                req.flash('error', "Email address already taken for some other account.");
                res.redirect(namedRouter.urlFor('admin.profile', {
                    id: id
                }));
            } else {
                let userData = await userRepo.getByField({ _id: id });
                /* We are remove profile image after delete the user, because that user's image no more need and also increase the memory on server*/
                if (req.files && req.files.length) {
                    for (let file of req.files) {
                        if (userData.profile_image && file.fieldname == 'profile_image') {
                            if (fs.existsSync('./public/uploads/user/' + userData.profile_image) && userData.profile_image) {
                                fs.unlinkSync('./public/uploads/user/' + userData.profile_image);
                            }
                        }
                        req.body.profile_image = file.filename;
                    }
                }
                req.body.full_name = `${req.body.first_name} ${req.body.last_name}`;
                let userUpdate = await userRepo.updateById(req.body, id);
                if (!_.isEmpty(userUpdate) && userUpdate._id) {
                    req.flash('success', "Profile updated successfully.");
                    res.redirect(namedRouter.urlFor('user.dashboard'));
                } else {
                    req.flash('error', "Failed to update profile.");
                    res.redirect(namedRouter.urlFor('admin.profile', {
                        id: id
                    }));
                }
            }
        } catch (err) {
            return res.status(500).send({
                message: err.message
            });
        }
    };

    /**
      * @Method adminUpdatePassword
      * @Description Admin password change
    */
    async adminUpdatePassword(req, res) {
        try {
            let user = await userRepo.getById(req.body.id);
            if (!_.isEmpty(user)) {
                if (!user.validPassword(req.body.old_password, user.password)) {
                    req.flash('error', "Sorry old password mismatched!");
                    res.redirect(namedRouter.urlFor('admin.security', { id: user._id }));
                } else {
                    if (req.body.password != req.body.old_password) {
                        let new_password = new User().generateHash(req.body.password);
                        let userUpdate = await userRepo.updateById({
                            "password": new_password
                        }, user._id);

                        if (userUpdate && userUpdate._id) {
                            /* The Following Commented Pasrt Is By Default, When Admin Successfully Update Their Password He/She Will Show The Success Message But As Per QA Report After Password Change Admin Should Logout, So That We Will Update It To req.session.destroy */

                            // req.flash('success', "Your password has been changed successfully.");
                            // res.redirect('/');

                            req.session.destroy(function (err) {
                                res.redirect('/');
                            });
                        } else {
                            req.flash('error', "Failed to update password.");
                            res.redirect(namedRouter.urlFor('user.dashboard'));
                        }
                    } else {
                        req.flash('error', "Your New Password And Old Password should not match.");
                        res.redirect(namedRouter.urlFor('admin.security', { id: user._id }));
                    }
                }
            } else {
                req.flash('error', "Something went wrong! No user found.");
                res.redirect(namedRouter.urlFor('admin.security', { id: user._id }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
       * @Method forgotPassword
       * @Description User Forgot Password
    */
    async forgotPassword(req, res) {
        try {
            req.body.email = req.body.email.trim().toLowerCase().toString();
            let roleDetails = await roleRepo.getByField({ role: "admin" });
            let result = {};
            let user = await User.findOne({ email: { $regex: '^' + req.body.email + '$', $options: 'i' }, role: { $in: [roleDetails._id] } }).exec();
            if (!user) {
                result.status = 500;
                return res.status(201).send({ "result": result, "message": "User not found", "status": false });
            } else {
                let random_pass = utils.betweenRandomNumber(10000000, 99999999)
                let readable_pass = random_pass;
                random_pass = new User().generateHash(random_pass);
                let user_details = await User.findByIdAndUpdate(user._id, { password: random_pass }).exec();
                if (!user_details) {
                    result.status = 500;
                    return res.status(201).send({ "result": result, "message": "User not found", "status": false });
                } else {

                    let emailData = { name: user.first_name, password: readable_pass };
                    let sendMail = await mailHelper.sendMail(`${project_name} Admin<${config.sendgrid.from_email}>`, user.email, `Reset Password || ${project_name}`, 'admin-user-change-password', emailData);

                    if (sendMail) {
                        result.status = 200;
                        return res.status(200).send({ "result": result, "message": "Mail sent to your email address with new password", "status": false });
                    } else {
                        result.status = 500;
                        return res.status(500).send({ "result": result, "message": "Failed to trigger mail", "status": false });
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: err.message });
        }
    };


    async create(req, res) {
        try {

            res.render('user/views/add', {
                page_name: 'user-management',
                page_title: 'Add User',
                user: req.user
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    // async insert(req, res) {
    //     try {
    //         let status = '';
    //         if (req.query.status) {
    //             status = req.query.status;
    //         }

    //         if (_.isEmpty(req.body.full_name)) {
    //             req.flash('error', 'Full Name Should Not Be Empty!');
    //             res.redirect(namedRouter.urlFor('user.create'));
    //             return;
    //         } else {
    //             req.body.first_name = req.body.full_name.split(" ")[0];
    //             req.body.last_name = req.body.full_name.split(" ")[1];
    //         }

    //         if (_.isEmpty(req.body.email)) {
    //             req.flash('error', 'Email Should Not Be Empty!');
    //             res.redirect(namedRouter.urlFor('user.create'));
    //             return;
    //         }

    //         if (_.isEmpty(req.body.user_type)) {
    //             req.flash('error', 'User type must be selected!');
    //             res.redirect(namedRouter.urlFor('user.create'));
    //             return;
    //         }

    //         let userRole = await roleRepo.getByField({ role: 'user' });
    //         req.body.role = userRole._id;
    //         req.body.password = new User().generateHash(req.body.password);

    //         let saveData = await userRepo.save(req.body);
    //         if (!_.isEmpty(saveData) && saveData._id) {
    //             req.flash('success', 'User Added Successfully!');
    //             res.redirect(namedRouter.urlFor('admin.user.listing'));
    //         } else {
    //             req.flash('error', 'User Not Added Successfully!');
    //             res.redirect(namedRouter.urlFor('user.create'));
    //         }


    //     } catch (err) {
    //         console.log(err);
    //         throw err;
    //     }
    // };
}

module.exports = new UserController();