const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const regionRepo = require("region/repositories/region.repository");
const cityRepo = require("city/repositories/city.repository");
const suburbRepo = require("suburb/repositories/suburb.repository");


class LocationController {
    constructor() { }

    async getAllRegion(req, res) {
        try {
            let regionData = await regionRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(regionData)) {
                requestHandler.sendSuccess(res, 'All Region fetched successfully.')(regionData);
            } else {
                requestHandler.throwError(400, 'Bad Request', 'Regions Not Found')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async getAllCityByRegion(req, res) {
        try {
            let params = {
                "isDeleted": false,
                "status": "Active",
            }
            if (req.query.region != "" && req.query.region != null) {
                params["region"] =  mongoose.Types.ObjectId(req.query.region);
            }
            
            let cityData = await cityRepo.getAllByField(params);

            if (!_.isEmpty(cityData)) {
                requestHandler.sendSuccess(res, 'All cities fetched successfully.')(cityData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };



    async getAllSuburbByRegionCity(req, res) {
        try {
            if (req.query.region == "" || req.query.region == null) {
                requestHandler.throwError(400, 'Bad Request', 'Region cannot be blank or null')();
                // return { status: 400, message: "Region cannot be blank or null" };
            }

            if (req.query.city == "" || req.query.city == null) {
                requestHandler.throwError(400, 'Bad Request', 'City cannot be blank or null')();
                // return { status: 400, message: "City cannot be blank or null" };
            }

            let suburbData = await suburbRepo.getAllByField({
                "region": mongoose.Types.ObjectId(req.query.region),
                "city": mongoose.Types.ObjectId(req.query.city),
                "isDeleted": false,
                "status": "Active",
            });

            if (!_.isEmpty(suburbData)) {
                requestHandler.sendSuccess(res, 'All suburbs fetched successfully.')(suburbData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


};


module.exports = new LocationController();