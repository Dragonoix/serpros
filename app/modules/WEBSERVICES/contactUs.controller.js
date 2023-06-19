const config = require(appRoot + '/config/index');
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const contactUsRepo = require('contactUs/repositories/contactUs.repository')

const moment = require('moment')




class ContactUsController {
    constructor() { }

    async submit(req, res) {
        try {
            if (!_.has(req.body, 'firstName') || (_.has(req.body, 'firstName') && _.isUndefined(req.body.firstName)) || _.isEmpty(req.body.firstName.trim()) || _.isNull(req.body.firstName)) {
                requestHandler.throwError(400, 'Bad Request', 'First Name Is Required')();
            } else if (!_.has(req.body, 'lastName') || (_.has(req.body, 'lastName') && _.isUndefined(req.body.lastName)) || _.isEmpty(req.body.lastName.trim()) || _.isNull(req.body.lastName)) {
                requestHandler.throwError(400, 'Bad Request', 'Last Name Is Required')();
            } else if (!_.has(req.body, 'email') || (_.has(req.body, 'email') && _.isUndefined(req.body.email)) || _.isEmpty(req.body.email.trim()) || _.isNull(req.body.email)) {
                requestHandler.throwError(400, 'Bad Request', 'Email Is Required')();
            } else if (!_.has(req.body, 'phone') || (_.has(req.body, 'phone') && _.isUndefined(req.body.phone)) || _.isEmpty(req.body.phone.trim()) || _.isNull(req.body.phone)) {
                requestHandler.throwError(400, 'Bad Request', 'Phone Number Is Required')();
            } else if (!_.has(req.body, 'message') || (_.has(req.body, 'message') && _.isUndefined(req.body.message)) || _.isEmpty(req.body.message.trim()) || _.isNull(req.body.message)) {
                requestHandler.throwError(400, 'Bad Request', 'Message Is Required')();
            } else {
                req.body.email = req.body.email.toLowerCase();
                req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
                let savedData = await contactUsRepo.save(req.body);
                if (!_.isEmpty(savedData) && savedData._id) {
                    let filteredData = await contactUsRepo.getByParamsCustom({ _id: savedData._id });
                    if (!_.isEmpty(filteredData)) {
                        requestHandler.sendSuccess(res, 'Message Sent Successfully')(filteredData[0])
                    } else {
                        requestHandler.throwError(400, 'Bad Request', 'Error In Data Filtering!');
                    }
                } else {
                    requestHandler.throwError(400, 'Bad Request', 'Something Went Wrong, Message Not Sent');
                }
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }
};


module.exports = new ContactUsController();