const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const disputeRepo = require("dispute/repositories/dispute.repository");


class DisputeController {
    constructor() { }

    async getAllDisputeById(req, res) {
        try {
            let disputeData = await disputeRepo.getAllByField({ "createdby_id": mongoose.Types.ObjectId(req.params.id), "isDeleted": false });

            if (!_.isEmpty(disputeData)) {
                requestHandler.sendSuccess(res, 'All disputes fetched successfully.')(disputeData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async saveDispute(req, res) {
        try {
            req.body.ticket_number = Date.now();
            req.body.createdby_id = req.user._id;
            if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Job Id Is Required')();
            } else if (!_.has(req.body, 'milestone_id') || (_.has(req.body, 'milestone_id') && _.isUndefined(req.body.milestone_id)) || _.isNull(req.body.milestone_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Milestone Id Is Required')();
            }else if (!_.has(req.body, 'dispute') || (_.has(req.body, 'dispute') && _.isUndefined(req.body.dispute)) || _.isNull(req.body.dispute)) {
                requestHandler.throwError(400, 'Bad Request', 'Dispute Is Required')();
            } else {
                let disputeData = await disputeRepo.save(req.body);
                if (!_.isEmpty(disputeData)) {
                    requestHandler.sendSuccess(res, 'Dispute Saved successfully.')(disputeData);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Dispute not saved")();
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };



};


module.exports = new DisputeController();