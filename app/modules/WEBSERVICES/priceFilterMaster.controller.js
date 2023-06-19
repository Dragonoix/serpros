const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const priceFilterMasterRepo = require("priceFilterMaster/repositories/priceFilterMaster.repository");



class PriceFilterMasterController {
    constructor() { }

    async getAllPriceFilter(req, res) {
        try {
            let priceFilterMasterData = await priceFilterMasterRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(priceFilterMasterData)) {
                requestHandler.sendSuccess(res, 'All PriceFilterMasters fetched successfully.')(priceFilterMasterData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


};


module.exports = new PriceFilterMasterController();