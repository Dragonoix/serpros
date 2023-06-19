const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const ContactUsCmsSchema = new Schema({
    header: { type: String, default: '' },
    sub_header: { type: String, default: '' },

    icon1: { type: String, default: '' },
    heading1: { type: String, default: '' },
    description1: { type: String, default: '' },
    btn_text1: { type: String, default: '' },
    btn_url1: { type: String, default: '' },

    icon2: { type: String, default: '' },
    heading2: { type: String, default: '' },
    description2: { type: String, default: '' },
    btn_text2: { type: String, default: '' },
    btn_url2: { type: String, default: '' },

    icon3: { type: String, default: '' },
    heading3: { type: String, default: '' },
    description3: { type: String, default: '' },
    btn_text3: { type: String, default: '' },
    btn_url3: { type: String, default: '' },

    isDeleted: {type: Boolean, default: false, enum: [true, false]}
}, { timestamps: true, versionKey: false });

// For pagination
ContactUsCmsSchema.plugin(mongooseAggregatePaginate);

// create the model for ContactUsCms and expose it to our app
module.exports = mongoose.model('ContactUsCms', ContactUsCmsSchema);