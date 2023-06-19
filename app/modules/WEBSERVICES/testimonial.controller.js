const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const testimonialRepo = require("testimonial/repositories/testimonial.repository");


class TestimonialController {
    constructor() { }

    async getAllTestimonial(req, res) {
        try {
            let testimonialData = await testimonialRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(testimonialData)) {
                requestHandler.sendSuccess(res, 'All testimonials fetched successfully.')(testimonialData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new TestimonialController();