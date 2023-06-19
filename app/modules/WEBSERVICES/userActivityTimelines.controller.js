const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const userActivityTimelinesRepo = require("userActivityTimelines/repositories/userActivityTimelines.repository");
const notificationRepo = require("notification/repositories/notification.repository");
const jobRepo = require("job/repositories/job.repository");
const proposalRepo = require("proposal/repositories/proposal.repository");



class UserActivityTimelinesController {
    constructor() { }

    async getMyActivityTimelines(req, res) {
        try {
            let userActivityTimelinesData = await userActivityTimelinesRepo.getAllByField({ "userId": req.user._id, "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(userActivityTimelinesData)) {
                requestHandler.sendSuccess(res, 'All Activity fetched successfully.')(userActivityTimelinesData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async getMyPartnerActivity(req, res) {
        try {
            let activitySumarry = {};
            if (req.user.user_type == 'client') {
                let total_posted = await jobRepo.getDocumentCount({ userId: req.user._id });
                let total_awarded = await jobRepo.getDocumentCount({ userId: req.user._id, openForBid: false });
                let in_progress = await jobRepo.getDocumentCount({ userId: req.user._id, openForBid: false, is_completed: false });
                let pending_proposals = await jobRepo.pendingProposal(req.user._id);
                let paid_out = await jobRepo.jobPaidout(req.user._id);
                activitySumarry = {
                    total_posted,
                    total_awarded,
                    in_progress,
                    pending_proposals: pending_proposals.count,
                    paid_out: paid_out.paid_out
                }

            } else {
                let pending_proposals = await proposalRepo.getDocumentCount({ proposal_from: req.user._id, proposal_status: 'Pending' });
                let projects_awarded = await proposalRepo.getDocumentCount({ proposal_from: req.user._id, proposal_status: 'Accepted' });
                let earnings = await proposalRepo.myEarnings(req.user._id);
                let in_progress = await proposalRepo.inProgress(req.user._id);

                activitySumarry = {
                    pending_proposals,
                    projects_awarded,
                    earnings: earnings.earnings,
                    in_progress: in_progress.count

                }
            }

            let params = {
                to_user_id: req.user._id,
                isDeleted: false,
                status: 'Active'
            }

            if (req.params.query == 'complete') {
                params['sub_type'] = 'complete'
            } else if (req.params.query == 'pending') {
                params['sub_type'] = {
                    $nin: ['complete', 'payment', 'newJob']
                }
            } else if (req.params.query == 'openJob') {

                params['sub_type'] = 'newJob'
            }

            let data = await notificationRepo.getAllActivity(params);

            
            requestHandler.sendSuccess(res, 'Activity list fetched successfully.')({ list: data, activitySumarry });
            
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new UserActivityTimelinesController();