const express = require("express");
const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const userRepo = require('user/repositories/user.repository');
const jobRepo = require('job/repositories/job.repository');
const proposalRepo = require('proposal/repositories/proposal.repository');
const milestoneRepo = require('milestones/repositories/milestones.repository');
const transactionRepo = require('transaction/repositories/transaction.repository');

const moment = require("moment");
const notification = require('../../helper/socketIoNotification');
const stripe = require("../../helper/stripePayment");



class MilestonesController {
    constructor() {

    }


    /* @Method: AddUserMilestone
    // @Description: Add User's Milestones in dashboard
    */
    async AddMilestone(req, res) {
        try {
            let proposal = await proposalRepo.getByField({ job_id: mongoose.Types.ObjectId(req.body.job_id), proposal_status: 'Accepted' })
            let job = await jobRepo.getById(mongoose.Types.ObjectId(req.body.job_id));
            if (!_.isEmpty(proposal) && !_.isEmpty(job)) {
                let left_budget = 0;

                if (proposal.rate != 0) {
                    const milestones = await milestoneRepo.getAllByField({
                        "isDeleted": false,
                        "status": "Active",
                        "job_id": mongoose.Types.ObjectId(req.body.job_id)
                    });

                    if (milestones.length > 0) {
                        let milestoneSum_amount = milestones.reduce((n, { amount }) => n + amount, 0)
                        left_budget = proposal.rate - milestoneSum_amount
                    } else {
                        left_budget = proposal.rate
                    }
                    if (parseFloat(req.body.amount) > left_budget) {
                        return requestHandler.throwError(400, 'Bad Request', "Milestone amount cannot be greater than budget. ")();
                    }

                }

                req.body.created_by = req.user._id;
                const milestoneData = await milestoneRepo.save(req.body);
                if (!_.isEmpty(milestoneData)) {
                    // //notify user 
                    // notification.Notify(job.userId, { type: 'milestone', subtype: 'added', message: "New milestone added" });
                    //notify user 
                    let data = {
                        id: job.userId,
                        payload: { type: 'milestone', subtype: 'added', message: "New milestone added." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: job.userId,
                            notification_message: "New milestone (" + milestoneData.name + ") has been added for " + job.title,
                            notification_against: { data: "job_id", value: req.body.job_id },
                            type: "milestone",
                            
                        }
                    }
                    notification.SendNotification(data);
                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Milestone Created',
                        description: 'New Milestone created for ' + job.title,
                    });

                    requestHandler.sendSuccess(res, 'Milestone created Successfully')(milestoneData);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
                }

            } else {
                requestHandler.throwError(400, 'Bad Request', "Invalid Job Id")();
            }

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async milestoneListByJob(req, res) {
        try {
            let payload = {};
            const job = await jobRepo.getJobDetailsById(req);
            if (!_.isEmpty(job)) {
                payload["job_details"] = job[0];
            } else {
                return requestHandler.sendSuccess(res, 'Invalid Job Id.')([]);
            }

            let userDetail = await jobRepo.getUserDetail(req);
            payload['user_details'] = userDetail;
            
            const milestone = await milestoneRepo.getAllByField({
                "isDeleted": false,
                "status": "Active",
                "job_id": mongoose.Types.ObjectId(req.params.id)
            });
            if (!_.isEmpty(milestone)) {
                let filter = milestone.filter(e => e.milestone_status == 'Pending').length;
                if (filter == 0) {
                    payload["pending_review"] = false;
                } else {
                    payload["pending_review"] = true;
                }

                let completeFilter = milestone.filter(e => e.is_completed === false).length;
                if (completeFilter == 0) {
                    payload["job_complete"] = true;
                } else {
                    payload["job_complete"] = false;
                }

                payload["milestones"] = milestone;
                payload['created_by'] = milestone[0].created_by

            } else {
                payload["milestones"] = [];
            }

            requestHandler.sendSuccess(res, 'Milestone list and Job details fetched Successfully.')(payload);
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };


    async AcceptRejectMileStone(req, res) {
        try {

            if (!_.has(req.body, 'status') || ((_.has(req.body, 'status') && (_.isUndefined(req.body.status)) || _.isNull(req.body.status) || _.isEmpty(req.body.status.trim())))) {
                return requestHandler.throwError(400, 'Bad Request', 'Status is required!')();
            }

            if (!_.has(req.body, 'milestone') || ((_.has(req.body, 'milestone') && (_.isUndefined(req.body.milestone)) || _.isNull(req.body.milestone)))) {
                return requestHandler.throwError(400, 'Bad Request', 'Milestone id is required!')();
            } else if (req.body.milestone == 'all') {
                if (!_.has(req.body, 'job_id') || ((_.has(req.body, 'job_id') && (_.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)))) {
                    return requestHandler.throwError(400, 'Bad Request', 'Job Id is required!')();
                }
                const milestone = await milestoneRepo.updateMany({ job_id: req.body.job_id, milestone_status: 'Pending', isDeleted: false },
                    { milestone_status: req.body.status, action_comment: req.body.comment });

                if (!_.isEmpty(milestone)) {
                    let proposal = await proposalRepo.getByField({ job_id: mongoose.Types.ObjectId(req.body.job_id), proposal_status: 'Accepted' })

                    // //notify user 
                    // notification.Notify(proposal.proposal_from, { type: 'milestone', subtype: 'accept/reject', message: "Milestone status updated" });

                    //notify user 
                    let data = {
                        id: proposal.proposal_from,
                        payload: { type: 'milestone', subtype: 'accept/reject', message: "Milestone status updated." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: proposal.proposal_from,
                            notification_message: "Milestone status updated." ,
                            notification_against: { data: "job_id", value: req.body.job_id },
                            type: "milestone"
                        }
                    }
                    notification.SendNotification(data);

                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Milestone Status Updated',
                        description: 'Milestone ' +req.body.status+ ' successfully.',
                    });

                    requestHandler.sendSuccess(res, 'Milestone status updated Successfully.')(milestone);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
                }
            } else {
                const milestone = await milestoneRepo.updateById(req.body.milestone, { milestone_status: req.body.status, action_comment: req.body.comment });

                if (!_.isEmpty(milestone)) {
                    let proposal = await proposalRepo.getByField({ job_id: mongoose.Types.ObjectId(req.body.job_id), proposal_status: 'Accepted' });
                    // //notify user 
                    // notification.Notify(proposal.proposal_from, { type: 'milestone', subtype: 'accept/reject', message: "Milestone status updated" });
                    //notify user 
                    let data = {
                        id: proposal.proposal_from,
                        payload: { type: 'milestone', subtype: 'accept/reject', message: "Milestone status updated." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: proposal.proposal_from,
                            notification_message: "Milestone status updated." ,
                            notification_against: { data: "job_id", value: req.body.job_id },
                            type: "milestone"
                        }
                    }
                    notification.SendNotification(data);

                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Milestone Status Updated',
                        description: 'Milestone ' +req.body.status+ ' successfully.',
                    });

                    requestHandler.sendSuccess(res, 'Milestone status updated Successfully.')(milestone);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
                }
            }

        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    };

    async DeleteMilestone(req, res) {
        try {
            const milestone = await milestoneRepo.updateById(req.params.id, { isDeleted: true });

            if (!_.isEmpty(milestone)) {
                requestHandler.sendSuccess(res, 'Milestone deleted Successfully.')(milestone);
            } else {
                requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    }


    async EditMilestone(req, res) {
        try {
            let payload = {};

            if (_.has(req.body, 'name') && !_.isUndefined(req.body.name) || !_.isNull(req.body.name)) {
                payload['name'] = req.body.name;
            }
            if (_.has(req.body, 'description') && !_.isUndefined(req.body.description) || !_.isNull(req.body.description)) {
                payload['description'] = req.body.description;
            }
            if (_.has(req.body, 'due_date') && !_.isUndefined(req.body.due_date) || !_.isNull(req.body.due_date)) {
                payload['due_date'] = req.body.due_date;
            }
            if (_.has(req.body, 'amount') && !_.isUndefined(req.body.amount) || !_.isNull(req.body.amount)) {
                payload['amount'] = req.body.amount;
            }


            const milestone = await milestoneRepo.updateById(req.params.id, payload);

            if (!_.isEmpty(milestone)) {

                //Activity record function
                utils.saveUserActivity({
                    userId: req.user._id,
                    title: 'Milestone Edit',
                    description: 'Milestone edited successfully.',
                });

                requestHandler.sendSuccess(res, 'Milestone updated Successfully.')(milestone);
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    }


    async milestonePayment(req, res) {
        try {
            if (!_.has(req.body, 'milestone_id') || ((_.has(req.body, 'milestone_id') && (_.isUndefined(req.body.milestone_id)) || _.isNull(req.body.milestone_id) || _.isEmpty(req.body.milestone_id.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
            }

            let milestoneData = await milestoneRepo.getById(mongoose.Types.ObjectId(req.body.milestone_id));
            if (!_.isEmpty(milestoneData)) {

                var params = {
                    "card_number": req.body.card_number,
                    "exp_month": req.body.exp_month,
                    "exp_year": req.body.exp_year,
                    "cvv": req.body.cvv,
                    "payment_amount": parseFloat(milestoneData.amount),
                    "name": req.user.full_name,
                    "email": req.user.email,
                    "address": req.user.stateName,
                }

                let paymentResult = await stripe.stripePayment(params);

                if (!_.isEmpty(paymentResult)) {

                    await transactionRepo.save({
                        trans_date: Date.now(),
                        jobId: milestoneData.job_id,
                        trans_id: new Date(),
                        amount: parseFloat(milestoneData.amount),
                        type: 'milestone',
                        description: "Milestone Payment",
                        paymentStatus: paymentResult.status,
                        stripe_transactionId: paymentResult.transcationID,
                        stripe_charge_id: paymentResult.chargeID
                    });

                    let payStat = paymentResult.status == 'succeeded' ? 'Paid' : (paymentResult.status == 'processing' ? 'Pending' : 'Failed');
                    let milestone = await milestoneRepo.updateById(req.body.milestone_id, { payment_status: payStat });


                    let proposal = await proposalRepo.getByField({ job_id: milestoneData.job_id, proposal_status: 'Accepted' })
                    // //notify user 
                    // notification.Notify(proposal.proposal_from, { type: 'milestone', subtype: 'payment', message: "Milestone payment done" });

                    //notify user 
                    let data = {
                        id: proposal.proposal_from,
                        payload: { type: 'milestone', subtype: 'payment', message: "Milestone payment done." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: proposal.proposal_from,
                            notification_message: "Payment cleared against milestone (" + milestoneData.name + ")",
                            notification_against: { data: "job_id", value: milestoneData.job_id },
                            type: "milestone",
                            sub_type: 'payment'
                        }
                    }
                    notification.SendNotification(data);

                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Milestone Payment',
                        description: 'Payment for milestone ('+milestoneData.name+') cleared.',
                    });

                    requestHandler.sendSuccess(res, 'Milestone payment cleared successfully.')(milestone);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Payment Gateway error")();
                }
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Something went wrong !")();
            }

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async SubmitMilestone(req, res) {
        try {

            if (_.has(req, 'files')) {
                if (req.files.length > 0) {
                    let imageArr = [];
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == 'job_submit_image') {
                            imageArr.push(req.files[i].filename);
                        }
                    }
                    req.body.job_submit_image = imageArr;
                }
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Please upload a image.")();

            }
            req.body.job_submit_status = true;
            req.body.job_submit_time = new Date();
            const milestone = await milestoneRepo.updateById(req.params.id, req.body);


            if (!_.isEmpty(milestone)) {
                let job = await jobRepo.getById(milestone.job_id);
                //notify user 
                // notification.Notify(job.userId, { type: 'milestone', subtype: 'submit', message: "Milestone progress submited" });
                //notify user 
                let data = {
                    id: job.userId,
                    payload: { type: 'milestone', subtype: 'submit', message: "Milestone progress submited." },
                    data: {
                        from_user_id: req.user._id,
                        to_user_id: job.userId,
                        notification_message: "Milestone progress submited for " + job.title,
                        notification_against: { data: "job_id", value: milestone.job_id },
                        type: "milestone"
                    }
                }
                notification.SendNotification(data);
                
                //Activity record function
                utils.saveUserActivity({
                    userId: req.user._id,
                    title: 'Milestone Submited',
                    description: 'Milestone submited for  ('+milestone.name+')',
                });

                requestHandler.sendSuccess(res, 'Milestone submited Successfully.')(milestone);
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    }


    async CompleteMilestone(req, res) {
        try {
            const milestone = await milestoneRepo.updateById(req.params.id, { is_completed: true });

            if (!_.isEmpty(milestone)) {

                let proposal = await proposalRepo.getByField({ job_id: milestone.job_id, proposal_status: 'Accepted' })
                //notify user 
                // notification.Notify(proposal.proposal_from, { type: 'milestone', subtype: 'completed', message: "Milestone marked as complete" });
                //notify user 
                let data = {
                    id: proposal.proposal_from,
                    payload: { type: 'milestone', subtype: 'completed', message: "Milestone marked as complete." },
                    data: {
                        from_user_id: req.user._id,
                        to_user_id: proposal.proposal_from,
                        notification_message: "Milestone ("+milestone.name+") has been marked as complete",
                        notification_against: { data: "job_id", value: milestone.job_id },
                        type: "milestone",
                        sub_type: 'complete'
                    }
                }
                notification.SendNotification(data);

                //Activity record function
                utils.saveUserActivity({
                    userId: req.user._id,
                    title: 'Milestone Completed',
                    description: 'Milestone completed for  ('+milestone.name+')',
                });
                
                requestHandler.sendSuccess(res, 'Milestone Marked as Complete Successfully.')(milestone);
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Something went wrong!!")();
            }
        } catch (e) {
            return requestHandler.sendError(req, res, e);
        }
    }



    async requestMilestone(req, res) {
        try {
            let proposal = await proposalRepo.getByField({ job_id: req.params.id, proposal_status: 'Accepted' });
            let job = await jobRepo.getById(mongoose.Types.ObjectId(req.params.id));
            if (!_.isEmpty(proposal)) {
                //notify user 
                let data = {
                    id: proposal.proposal_from,
                    payload: { type: 'push-notify', subtype: 'request', message: "Milestone add request." },
                    data: {
                        from_user_id: req.user._id,
                        to_user_id: proposal.proposal_from,
                        notification_message: "You have a request for adding milestone for " + job.title,
                        notification_against: { data: "job_id", value: req.params.id },
                        type: "milestone"
                    }
                }
                notification.SendNotification(data);

                requestHandler.sendSuccess(res, 'Request notification sent successfully.')();
            } else {
                return requestHandler.throwError(400, 'Bad Request', "Invalid job id")();
            }

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


};

module.exports = new MilestonesController();