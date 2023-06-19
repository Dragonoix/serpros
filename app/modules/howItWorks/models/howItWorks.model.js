const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const HowItWorksSchema = new Schema({
    header: { type: String, default: '' },
    sub_header: { type: String, default: '' },
    side_image: {type: String, default: ''},
    heading1: { type: String, default: '' },
    description1: { type: String, default: '' },
    short_description1: { type: String, default: '' },
    image1: { type: String, default: '' },
    btn_text1: { type: String, default: '' },
    btn_url1: { type: String, default: '' },

    heading2: { type: String, default: '' },
    description2: { type: String, default: '' },
    short_description2: { type: String, default: '' },
    image2: { type: String, default: '' },
    btn_text2: { type: String, default: '' },
    btn_url2: { type: String, default: '' }, 

    heading3: { type: String, default: '' },
    description3: { type: String, default: '' },
    short_description3: { type: String, default: '' },
    image3: { type: String, default: '' },
    btn_text3: { type: String, default: '' },
    btn_url3: { type: String, default: '' },

    isDeleted: {type: Boolean, default: false, enum: [true, false]}
}, { timestamps: true, versionKey: false });

// For pagination
HowItWorksSchema.plugin(mongooseAggregatePaginate);

// create the model for HowItWorks and expose it to our app
module.exports = mongoose.model('HowItWorks', HowItWorksSchema);