const cmsRepo = require('cms/repositories/cms.repository');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const mongoose = require('mongoose');


class cmsController {
    constructor() {
        this.cms = [];
    }

    /* @Method: list
    // @Description: To get all the cms from DB
    */
    async list(req, res) {
        try {
            res.render('cms/views/list.ejs', {
                page_name: 'cms-management',
                page_title: 'General CMS',
                user: req.user,
            });
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    };

    /* @Method: getAll
    // @Description: To get all the cms from DB action
    */
    async getAll(req, res) {
        try {
            let start = parseInt(req.body.start);
            let length = parseInt(req.body.length);
            let currentPage = 1;
            if (start>0) {
                currentPage = parseInt((start + length) / length);
            }
            req.body.page = currentPage;
            let cms = await cmsRepo.getAll(req);
            let data = {
                "recordsTotal": cms.total,
                "recordsFiltered": cms.total,
                "data": cms.docs
            };
            return {
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            };
        } catch (e) {
            return { status: 500, data: [], message: e.message };
        }
    };

    /* @Method: update
    // @Description: cms update action
    */
    async update(req, res) {
        try {
            const cmsId = mongoose.Types.ObjectId(req.body.id);
            let cmsData = await cmsRepo.getByField({ 'title': req.body.title, _id: { $ne: cmsId }, isDeleted: false });
            if (_.isEmpty(cmsData)) {
                    if (!req.body['content']) {
                        req.flash('error', 'Content is required.');
                    } else {
                        // let cms = await cmsRepo.getById(cmsId);
                        let cmsIdUpdate = await cmsRepo.updateById(req.body, cmsId)
                        if (cmsIdUpdate && cmsIdUpdate._id) {
                            req.flash('success', "CMS Updated Successfully");
                        } else {
                            req.flash('error', "Failed to update CMS content!");
                        }
                    }
            } else {
                req.flash('error', "CMS is already availabe!");
            }

            res.redirect(namedRouter.urlFor('admin.cms.list'));
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: e.message });
        }
    };

}

module.exports = new cmsController();