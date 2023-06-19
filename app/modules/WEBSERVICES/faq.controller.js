const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const faqRepo = require("faqManagement/repositories/faqManagement.repository");


class FaqController {
    constructor() { }

    async getAllFaq(req, res) {
        try {
            let faqData = await faqRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(faqData)) {
                requestHandler.sendSuccess(res, 'All faqs fetched successfully.')(faqData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new FaqController();