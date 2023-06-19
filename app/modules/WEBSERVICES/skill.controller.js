const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const skillRepo = require("skills/repositories/skills.repository");


class SkillController {
    constructor() { }

    async getAllSkill(req, res) {
        try {
            let skillData = await skillRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(skillData)) {
                requestHandler.sendSuccess(res, 'All skills fetched successfully.')(skillData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new SkillController();