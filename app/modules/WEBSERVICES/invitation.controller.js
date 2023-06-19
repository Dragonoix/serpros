const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const invitationRepo = require("invitation/repositories/invitation.repository");
const jobRepo = require("job/repositories/job.repository");

const notification = require('../../helper/socketIoNotification');


class InvitationController {
    constructor() { }

    async saveInvitation(req, res) {
        try {
            if (!_.has(req.body, 'servicer_id') || (_.has(req.body, 'servicer_id') && _.isUndefined(req.body.servicer_id)) || _.isNull(req.body.servicer_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Servicer Id Is Required')();
            } else if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Job Id Is Required')();
            } else {
                let checkIfExists = await invitationRepo.getByField({
                    invitation_from: req.user._id,
                    invitation_to: mongoose.Types.ObjectId(req.body.servicer_id),
                    job_id: mongoose.Types.ObjectId(req.body.job_id)
                })

                if (!_.isEmpty(checkIfExists) && checkIfExists._id) {
                    requestHandler.sendSuccess(res, 'Invitation has already been sent.')(checkIfExists);
                } else {
                    let data = {
                        invitation_from: req.user._id,
                        invitation_to: req.body.servicer_id,
                        job_id: req.body.job_id
                    }
                    let invitationData = await invitationRepo.save(data);

                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Invitation Save',
                        description: 'Invitation saved successfully.',
                    });


                    let jobData = await jobRepo.getById(req.body.job_id);
                    //notify servicer
                    let notidata = {
                        id: req.body.servicer_id,
                        payload: { type: 'job', subtype: 'accept', message: "Job Invitation." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: req.body.servicer_id,
                            notification_message: "You have been invited by " +req.user.full_name+ " for a new job - " + jobData.title,
                            notification_against: { data: "job_id", value: req.body.job_id },
                            type: "job"
                        }
                    }

                    notification.SendNotification(notidata);

                    if (!_.isEmpty(invitationData)) {
                        requestHandler.sendSuccess(res, 'Invitation sent successfully.')(invitationData);
                    } else {
                        requestHandler.throwError(400, 'Bad Request', "Invitation not sent")();
                    }
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async myInvitations(req, res) {
        try {

            let invitationData = await invitationRepo.getAllByFieldCustom({
                invitation_to: req.user._id,
                isDeleted: false,
                status: "Active"
            });

            requestHandler.sendSuccess(res, 'Invitation list fetched successfully.')(invitationData);

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async invitationDismiss(req, res) {
        try {

            let invitationData = await invitationRepo.delete(req.params.id);

            if (!_.isEmpty(invitationData)) {
                requestHandler.sendSuccess(res, 'Invitation dismissed successfully.')();
            } else {
                requestHandler.throwError(400, 'Bad Request', "Invitation not dismissed")();
            }

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


};


module.exports = new InvitationController();