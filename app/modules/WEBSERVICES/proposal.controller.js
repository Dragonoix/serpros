const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const proposalRepo = require("proposal/repositories/proposal.repository");
const chatRepo = require("chat/repositories/chat.repository");
const jobRepo = require("job/repositories/job.repository");

const notification = require('../../helper/socketIoNotification');

class ProposalController {
    constructor() { }

    async saveProposal(req, res) {
        try {
            if (!_.has(req.body, 'rate') || (_.has(req.body, 'rate') && _.isUndefined(req.body.rate)) || _.isNull(req.body.rate)) {
                requestHandler.throwError(400, 'Bad Request', 'Rate of proposal Is Required')();
            } else if (!_.has(req.body, 'estimated_days') || (_.has(req.body, 'estimated_days') && _.isUndefined(req.body.estimated_days)) || _.isNull(req.body.estimated_days)) {
                requestHandler.throwError(400, 'Bad Request', 'Number of estimated days Is Required')();
            } else if (!_.has(req.body, 'description') || (_.has(req.body, 'description') && _.isUndefined(req.body.description)) || _.isNull(req.body.description)) {
                requestHandler.throwError(400, 'Bad Request', 'Description Is Required')();
            } else if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Job Id Is Required')();
            } else {
                if (req.files && req.files.length) {
                    let image = [];
                    for (let file of req.files) {
                        if (file.fieldname == 'image') {
                            image.push(file.filename);
                        }
                    }
                    req.body.image = image;
                }
                req.body.proposal_from = req.user._id;
                let findProposal = await proposalRepo.getByField({
                    proposal_from: req.user._id,
                    job_id: mongoose.Types.ObjectId(req.body.job_id)
                })
                if (!_.isEmpty(findProposal)) {
                    return requestHandler.throwError(400, 'Bad Request', "Proposal already sent against this job !")();
                }
                let proposalData = await proposalRepo.save(req.body);
                if (!_.isEmpty(proposalData)) {
                    let jobData = await jobRepo.getById(req.body.job_id);
                    let findRoom = await chatRepo.findRoom(req.body.job_id, req.user._id);
                    let roomData = {};
                    if (!_.isEmpty(findRoom)) {
                        roomData = findRoom;
                    } else {
                        roomData = await chatRepo.createRoom({
                            created_by: req.user._id,
                            members: [req.user._id, jobData.userId],
                            unseen_count: [{ user_id: jobData.userId, count: 0 }, { user_id: req.user._id, count: 0 }],
                            notepad: [{ user_id: jobData.userId, notes: "" }, { user_id: req.user._id, notes: "" }],
                            job_id: req.body.job_id
                        });
                    }


                    //notify user 
                    let data = {
                        id: jobData.userId,
                        payload: { type: 'proposal', subtype: 'new', message: "New Proposal received." },
                        data: {
                            from_user_id: req.user._id,
                            to_user_id: jobData.userId,
                            notification_message: "New proposal received for " + jobData.title,
                            notification_against: { data: "proposal_id", value: proposalData._id },
                            type: "proposal"
                        }
                    }
                    notification.SendNotification(data);

                    //Activity record function
                    utils.saveUserActivity({
                        userId: req.user._id,
                        title: 'Proposal Save',
                        description: 'Proposal save successfully.',
                    });


                    requestHandler.sendSuccess(res, 'Proposal Sent successfully.')({ proposalData: proposalData, roomData });
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Proposal not saved")();
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async mySentProposals(req, res) {
        try {
            let user_id = req.user._id;

            let Data = await proposalRepo.getAllByFieldCustom({
                // "proposal_from": req.user._id,
                "logged_in_user": user_id,
                "isDeleted": false,
                "status": "Active",
            });

            //Activity record function
            utils.saveUserActivity({
                userId: req.user._id,
                title: 'Proposal Sent',
                description: 'Proposal sent successfully',
            });

            requestHandler.sendSuccess(res, 'Proposal list fetched successfully.')(Data);

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async proposalDetail(req, res) {
        try {
            req.params.id = mongoose.Types.ObjectId(req.params.id);

            let data = await proposalRepo.getDetailByField({ _id: req.params.id, isDeleted: false, status: 'Active' });
            if (!_.isEmpty(data) && !_.isNull(data)) {
                requestHandler.sendSuccess(res, 'Proposal detail fetched successfully')(data);
            } else {
                requestHandler.throwError(400, 'Bad Request', "Proposal data not found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }

    async statusChange(req, res) {
        try {
            if (req.body.status && !_.isEmpty(req.body.status.trim()) && (req.body.status == 'Rejected' || req.body.status == 'Accepted')) {
                req.body.id = mongoose.Types.ObjectId(req.body.id);
                let checkData = await proposalRepo.getByField({ _id: req.body.id, isDeleted: false });
                if (!_.isEmpty(checkData) && checkData._id) {
                    let updateStatus = await proposalRepo.updateById({ proposal_status: req.body.status }, checkData._id);
                    if (!_.isEmpty(updateStatus) && updateStatus._id) {
                        if (req.body.status == 'Accepted') {
                            let jobData = await jobRepo.updateById({ openForBid: false }, updateStatus.job_id);

                            //notify servicer
                            let data = {
                                id: checkData.proposal_from,
                                payload: { type: 'proposal', subtype: 'accept', message: "Proposal accepted." },
                                data: {
                                    from_user_id: req.user._id,
                                    to_user_id: checkData.proposal_from,
                                    notification_message: "Your proposal has been accepted for " + jobData.title,
                                    notification_against: { data: "proposal_id", value: req.body.id },
                                    type: "proposal"
                                }
                            }
                            notification.SendNotification(data);
                        }

                        requestHandler.sendSuccess(res, 'Proposal status updated successfully')({ proposalData: updateStatus });
                    } else {
                        requestHandler.throwError(400, 'Bad Request', 'Failed to update status')()
                    }
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Proposal data not found")();
                }
            } else {
                return requestHandler.throwError(400, 'Bad Request', 'Status is required')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


};


module.exports = new ProposalController();