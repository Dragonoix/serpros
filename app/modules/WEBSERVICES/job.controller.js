const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const jwt = require("jsonwebtoken");
const requestHandler = new RequestHandler(logger);
const jobRepo = require("job/repositories/job.repository");
const proposalRepo = require("proposal/repositories/proposal.repository");
const userRepo = require('user/repositories/user.repository');
const milestoneRepo = require('milestones/repositories/milestones.repository');

const notification = require('../../helper/socketIoNotification');




class JobController {
    constructor() { }

    async getAllJobByUserId(req, res) {
        try {
            let jobData = await jobRepo.getAllByField({ "userId": mongoose.Types.ObjectId(req.user._id), "isDeleted": false });

            if (!_.isEmpty(jobData)) {
                requestHandler.sendSuccess(res, 'All Jobs fetched successfully.')(jobData);
            } else {
                requestHandler.throwError(201, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async getAllAcceptedJobByUser(req, res) {
        try {
            let jobData = await proposalRepo.acceptedJobByUser(req.user._id);

            if (!_.isEmpty(jobData)) {
                requestHandler.sendSuccess(res, 'All Jobs fetched successfully.')(jobData);
            } else {
                requestHandler.throwError(201, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async saveJob(req, res) {
        try {
            req.body.userId = req.user._id;

            if (req.files && req.files.length) {
                let uploaded = [];
                let attachments = []
                for (let file of req.files) {
                    if (file.fieldname == 'files') {
                        uploaded.push(file.filename);
                    } else if (file.fieldname == 'description_attachment') {
                        attachments.push(file.filename);
                    }

                }
                req.body.files = uploaded;
                req.body.description_attachment = attachments;
            }

            if (!_.has(req.body, 'category') || (_.has(req.body, 'category') && _.isUndefined(req.body.category)) || _.isNull(req.body.category)) {
                requestHandler.throwError(400, 'Bad Request', 'Category Is Required')();
            } else if (!_.has(req.body, 'description') || (_.has(req.body, 'description') && _.isUndefined(req.body.description)) || _.isNull(req.body.description)) {
                requestHandler.throwError(400, 'Bad Request', 'Description Is Required')();
            } else if (!_.has(req.body, 'region') || (_.has(req.body, 'region') && _.isUndefined(req.body.region)) || _.isNull(req.body.region)) {
                requestHandler.throwError(400, 'Bad Request', 'Region Is Required')();
            } else if (!_.has(req.body, 'district') || (_.has(req.body, 'district') && _.isUndefined(req.body.district)) || _.isNull(req.body.district)) {
                requestHandler.throwError(400, 'Bad Request', 'District Is Required')();
            } else if (!_.has(req.body, 'suburb') || (_.has(req.body, 'suburb') && _.isUndefined(req.body.suburb)) || _.isNull(req.body.suburb)) {
                requestHandler.throwError(400, 'Bad Request', 'Suburb Is Required')();
            }
            else if (!_.has(req.body, 'budget') || (_.has(req.body, 'budget') && _.isUndefined(req.body.budget)) || _.isNull(req.body.budget)) {
                req.body.budget = 0;
            }
            else {
                let jobData = await jobRepo.save(req.body);
                if (!_.isEmpty(jobData)) {
                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Job Created',
                        description: 'New Job created successfully.',
                    });
                    requestHandler.sendSuccess(res, 'Job Saved successfully.')(jobData);
                } else {
                    requestHandler.throwError(201, 'Bad Request', "Job not saved")();
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async openJobByCategory(req, res) {
        try {
            let params = {
                openForBid: true,
                isDeleted: false,
                status: 'Active'
            }

            if (req.query.category) {
                params = {
                    category: mongoose.Types.ObjectId(req.query.category),
                    openForBid: true,
                    isDeleted: false,
                    status: 'Active'
                }
            }

            let jobData = await jobRepo.getAllByFieldCustom(params, req.user._id);

            if (!_.isEmpty(jobData)) {
                requestHandler.sendSuccess(res, 'All Jobs fetched successfully.')(jobData);
            } else {
                requestHandler.throwError(201, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async getJobDetails(req, res) {
        try {
            if (_.has(req.headers, 'x-access-token')) {
                var decoded = jwt.verify((req.headers['x-access-token']), config.auth.jwtSecret);
                // console.log(decoded.id);
                req.user = await userRepo.getById(decoded.id);

                if (req.user._id) {
                    let jobData = await jobRepo.getJobDetailsById(req)
                    if (!_.isEmpty(jobData)) {
                        requestHandler.sendSuccess(res, 'Job details fetched successfully.')(jobData[0]);
                    } else {
                        requestHandler.throwError(400, 'Bad Request', "No record found")();
                    }
                } else {
                    requestHandler.throwError(403, 'Bad Request', 'Oops, no user found. Kindly proceed to signup')();
                }
            } else {
                let jobData = await jobRepo.getBasicJobDetail(req.params.id)
                if (!_.isEmpty(jobData)) {
                    requestHandler.sendSuccess(res, 'Job details fetched successfully.')(jobData);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "No record found")();
                }
            }

        } catch (error) {
            console.log("console error:", error);
            return requestHandler.sendError(req, res, error);
        }
    };




    async CompleteJob(req, res) {
        try {
            const pendingMilestone = await milestoneRepo.getAllByField({ job_id: mongoose.Types.ObjectId(req.params.id), is_completed: false, isDeleted: false });
            if (!_.isEmpty(pendingMilestone)) {
                return requestHandler.throwError(400, 'Bad Request', "Job cannot be marked as complete before completing all milestones")();
            }

            const unpaidMilestone = await milestoneRepo.getAllByField({
                job_id: mongoose.Types.ObjectId(req.params.id), payment_status: { $nin: ["Paid", "Refunded"] },
                isDeleted: false
            });
            if (!_.isEmpty(unpaidMilestone)) {
                return requestHandler.throwError(400, 'Bad Request', "Job cannot be marked as complete before clearing all milestone's due payment. Please clear all your due payments first.")();
            }

            let completeJob = await jobRepo.updateById({ is_completed: true }, req.params.id);
            if (!_.isEmpty(completeJob)) {
                let proposal = await proposalRepo.getByField({ job_id: req.params.id, proposal_status: 'Accepted' })
                //notify user 
                notification.Notify(proposal.proposal_from, { type: 'job', subtype: 'completed', message: "Job marked as complete" });
                //Activity record function
                utils.saveUserActivity({
                    userId: req.user._id,
                    title: 'Job Completed',
                    description: 'Job Marked as Complete Successfully.',
                });
                requestHandler.sendSuccess(res, 'Job Marked as Complete Successfully.')(completeJob);
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Invalid Job Id")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    }


    async getAllInvoices(req, res) {
        try {

            let jobInvoiceData = await jobRepo.getAllJobInvoices(req);
            if (!_.isEmpty(jobInvoiceData)) {
                requestHandler.sendSuccess(res, 'Invoices fetched successfully.')(jobInvoiceData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }

        } catch (error) {
            console.log("console error:", error);
            return requestHandler.sendError(req, res, error);
        }
    };


};


module.exports = new JobController();