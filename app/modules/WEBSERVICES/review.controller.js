const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const reviewRepo = require("review/repositories/review.repository");


class ReviewController {
    constructor() { }

    async getAllReviewById(req, res) {
        try {
            let reviewData = await reviewRepo.getAllByIdCustom(mongoose.Types.ObjectId(req.params.id));
            let ratingStat = await reviewRepo.reviewStat(mongoose.Types.ObjectId(req.params.id));
            

            if (!_.isEmpty(reviewData)) {
                requestHandler.sendSuccess(res, 'All reviews fetched successfully.')({reviews: reviewData, ratingStat: ratingStat});
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async saveReview(req, res) {
        try {
            req.body.review_by_user_id = req.user._id;
            if (!_.has(req.body, 'review_for_user_id') || (_.has(req.body, 'review_for_user_id') && _.isUndefined(req.body.review_for_user_id)) || _.isNull(req.body.review_for_user_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Review For User Id Is Required')();
            } else if (!_.has(req.body, 'job_id') || (_.has(req.body, 'job_id') && _.isUndefined(req.body.job_id)) || _.isNull(req.body.job_id)) {
                requestHandler.throwError(400, 'Bad Request', 'Service Request Id Is Required')();
            } else {
                let avg = (Number(req.body.workmanship) + Number(req.body.cost) + Number(req.body.schedule) + Number(req.body.communication) ) / 4 ;
                req.body.average = Math.round(avg *10) / 10;
                let reviewData = await reviewRepo.save(req.body);
                if (!_.isEmpty(reviewData)) {
                    requestHandler.sendSuccess(res, 'Review Saved successfully.')(reviewData);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Review not saved")();
                }
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };



};


module.exports = new ReviewController();