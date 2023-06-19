const mongoose = require("mongoose");
const favoriteRepo = require("favorite/repositories/favorite.repository");
const cmsRepo = require('cms/repositories/cms.repository');

const fs = require("fs");
const { log } = require("console");

class FavoriteController {
    constructor() { }

    async FavoritePageData(req, res) {
        try {
            let favoriteData = await favoriteRepo.getAllFavoriteData({ user_id: req.user._id, isDeleted: false, status: 'Active' });
            let cms = await cmsRepo.getByField({slug: "fav"})
            return { status: 200, data: favoriteData, cms: cms, "message": 'Favorite page data fetched successfully.' };
        } catch (error) {
            return { status: 500, data: {}, message: error.message };
        }
    };

    async addRemoveToFavorite(req, res) {
        try {
            req.body.user_id = req.user._id;

            let checkData = await favoriteRepo.getByField({ user_id: mongoose.Types.ObjectId(req.body.user_id), servicer_id: mongoose.Types.ObjectId(req.body.servicer_id) });

            //console.log(checkData);

            if (_.isObject(checkData)) {
                let postData = await favoriteRepo.deleteById(checkData._id);
                if (_.isObject(postData)) {
                    return { status: 200, data: checkData, message: 'Removed from favourite successfully.' };
                } else {
                    return{ status: 400, data: {}, message: 'Remove from favourite failed !' };
                }
            } else {
                let favoriteData = await favoriteRepo.save(req.body);
                if (favoriteData && favoriteData._id) {
                    return { status: 200, data: favoriteData, "message": 'Added to favourite successfully.' };
                } else {
                    return { status: 400, data: favoriteData, "message": 'Add to favourite failed !' };
                }
            }
        } catch (error) {
            return { status: 500, data: {}, message: error.message };
        }
    };

}
module.exports = new FavoriteController();
