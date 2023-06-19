const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const cmsRepo = require("cms/repositories/cms.repository");
const homePageRepo = require('homePage/repositories/homePage.repository');
const howItWorksRepo = require('howItWorks/repositories/howItWorks.repository');
const footerCmsRepo = require('footerCms/repositories/footerCms.repository');
const contactUsCms = require('contactUsCms/repositories/contactUsCms.repository');
const categoryRepo = require("categoryManagement/repositories/categoryManagement.repository");
const jobRepo = require("job/repositories/job.repository");
const proposalRepo = require("proposal/repositories/proposal.repository");



class CmsController {
    constructor() { }

     /**
     * 
     * @Method : details
     * @Description : To Fetch All CMS Details
     */
      async details(req, res) {
        try {
            req.params.slug = req.params.slug.trim();
            if (_.isEmpty(req.params.slug)) {
                requestHandler.throwError(400, 'Bad Request', 'Please Enter A Valid Slug!!!')();
            } else {
                let result = await cmsRepo.getCmsBySlug({ isDeleted: false, slug: req.params.slug });
                if (!_.isEmpty(result) && result.length) {
                    requestHandler.sendSuccess(res, 'CMS Fetched Successfully!!!')(result[0]);
                } else {
                    requestHandler.throwError(400, 'Bad Request', 'CMS Not Fetched Successfully!!!')();
                }
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }


    async getHomePageCms(req, res) {
        try {
            let homeData = await homePageRepo.getAllByField({ "isDeleted": false, "status": "Active" });
            let categoryData = await categoryRepo.getParentCategories();
            let recentJobs = await jobRepo.getRecentJobs();
            let expertProvider = await proposalRepo.getExpertProviders();
            // console.log(expertProvider);

            if (!_.isEmpty(homeData)) {
                homeData = homeData[0]
                let payload = {};
                payload["popular_services"] = categoryData;
                payload = {...payload, recentJobs, expertProvider, ...homeData._doc}
                requestHandler.sendSuccess(res, 'Home page content fetched successfully.')(payload);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async howItWorksCms(req, res) {
        try {
            let howItWorksData = await howItWorksRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(howItWorksData)) {
                requestHandler.sendSuccess(res, 'How It Works content fetched successfully.')(howItWorksData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

    async contactUsCms(req, res) {
        try {
            let contactUsCmsData = await contactUsCms.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(contactUsCmsData)) {
                requestHandler.sendSuccess(res, 'Contact Us content fetched successfully.')(contactUsCmsData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };


    async footerCms(req, res) {
        try {
            let footerData = await footerCmsRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(footerData)) {
                requestHandler.sendSuccess(res, 'Footer content fetched successfully.')(footerData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new CmsController();