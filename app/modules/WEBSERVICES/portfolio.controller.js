const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const portfolioRepo = require("portfolio/repositories/portfolio.repository");
const userRepo = require("user/repositories/user.repository");
const fs = require('fs');


class portfolioImageController {
    constructor() { }


    /**
    * @Method : add
    * @Description : To add Portfolio Post
    */
    async add(req, res) {
        try {
            req.body.user_id = req.user._id;

            // Upload Portfolio Images
            if (req.files && req.files.length) {
                let uploaded = [];
                for (let file of req.files) {
                    uploaded.push(file.filename)
                }
                req.body.files = uploaded;
            }

            let data = await portfolioRepo.save(req.body);

            //Activity record function
            utils.saveUserActivity({
                userId: req.user._id,
                title: 'Portfolio Add',
                description: 'Portfolio added successfully for',
            });

            return requestHandler.sendSuccess(res, 'Portfolio data added successfully')(data);
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }



    /**
    * @Method : update
    * @Description : To Update Portfolio Images
    */
    async update(req, res) {
        try {

            let response = {};


            // Upload Portfolio Images
            if (req.files && req.files.length) {
                let portfolioData = await portfolioRepo.getById(req.params.id);
                let uploaded = [...portfolioData.files];
                for (let file of req.files) {
                    uploaded.push(file.filename)
                }
                response = await portfolioRepo.updateById({ files: uploaded }, mongoose.Types.ObjectId(req.params.id));
            }



            // Update User Portfolio Description
            if (!_.isEmpty(req.body.text) && !_.isEmpty(req.body.text.trim())) {
                let updateDescription = await portfolioRepo.updateById({ text: req.body.text }, mongoose.Types.ObjectId(req.params.id));
                if (_.isEmpty(updateDescription)) {
                    return requestHandler.throwError(400, 'Bad Request', 'Something went wrong!')();
                } else {
                    response = updateDescription;
                }
            }


            // console.log(req.body.del_image);
            // Delete Images
            if (!_.isEmpty(req.body.del_image)) {
                let portfolioData = await portfolioRepo.getById(req.params.id);
                let uploaded = [...portfolioData.files];
                for (let file of req.body.del_image) {
                    const index = uploaded.indexOf(file);
                    if (index > -1) { // only splice uploaded when item is found
                        uploaded.splice(index, 1); // 2nd parameter means remove one item only
                        if (fs.existsSync("./public/uploads/portfolio-image/" + file)) {
                            fs.unlinkSync("./public/uploads/portfolio-image/" + file);
                        }
                    }
                }
                response = await portfolioRepo.updateById({ files: uploaded }, mongoose.Types.ObjectId(req.params.id));
            }

            //Activity record function
            utils.saveUserActivity({
                userId: req.user._id,
                title: 'Portfolio Update',
                description: 'Portfolio Updated successfully for',
            });

            // return requestHandler.sendSuccess(res, 'Portfolio data updated successfully')(uploaded_images);
            return requestHandler.sendSuccess(res, 'Portfolio data updated successfully')(response);
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }

    /**
    * @Method : list
    * @Description : To List Portfolio Images
    */
    async list(req, res) {
        try {
            let portfolioData = await portfolioRepo.getPostsByUser(req.user._id);
            if (!_.isEmpty(portfolioData)) {
                requestHandler.sendSuccess(res, 'Portfolio posts fetched successfully')(portfolioData);
            } else {
                requestHandler.throwError(400, 'Bad Request', 'Portfolio posts not found!')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }

    async details(req, res) {
        try {
            let portfolioData = await portfolioRepo.getById(req.params.id);
            if (!_.isEmpty(portfolioData)) {
                requestHandler.sendSuccess(res, 'Portfolio details fetched successfully')(portfolioData);
            } else {
                requestHandler.throwError(400, 'Bad Request', 'Portfolio details not found!')();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }


    async delete(req, res) {
        try {
            let portfolioData = await portfolioRepo.delete(req.params.id);
            if (!_.isEmpty(portfolioData)) {
                requestHandler.sendSuccess(res, 'Portfolio deleted successfully')(portfolioData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "Couldn't delete portfolio ! ")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    }  

};


module.exports = new portfolioImageController();