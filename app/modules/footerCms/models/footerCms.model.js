const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const FooterCmsSchema = new Schema({

    description: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },

    facebook_url: { type: String, default: '' },
    twitter_url: { type: String, default: '' },
    instagram_url: { type: String, default: '' },
    youtube_url: { type: String, default: '' },
    
    copyright: { type: String, default: '' },

    isDeleted: {type: Boolean, default: false, enum: [true, false]}
}, { timestamps: true, versionKey: false });

// For pagination
FooterCmsSchema.plugin(mongooseAggregatePaginate);

// create the model for FooterCms and expose it to our app
module.exports = mongoose.model('FooterCms', FooterCmsSchema);