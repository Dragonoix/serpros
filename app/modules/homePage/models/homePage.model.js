const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const HomePageSchema = new Schema({
    heading: { type: String, default: '' },
    sub_heading: { type: String, default: '' },
    banner: { type: Array, default: [] },

    sec1_heading: { type: String, default: '' },
    sec1_banner: { type: String, default: '' },

    sec1_header1: { type: String, default: '' },
    sec1_description1: { type: String, default: '' },
    sec1_icon1: { type: String, default: '' },

    sec1_header2: { type: String, default: '' },
    sec1_description2: { type: String, default: '' },
    sec1_icon2: { type: String, default: '' },

    sec1_header3: { type: String, default: '' },
    sec1_description3: { type: String, default: '' },
    sec1_icon3: { type: String, default: '' },

    sec2_heading: { type: String, default: '' },
    sec2_sub_heading: { type: String, default: '' },

    sec3_heading: { type: String, default: '' },
    sec3_sub_heading: { type: String, default: '' },

    sec4_heading: { type: String, default: '' },
    sec4_sub_heading: { type: String, default: '' },

    isDeleted: {type: Boolean, default: false, enum: [true, false]}
}, { timestamps: true, versionKey: false });

// For pagination
HomePageSchema.plugin(mongooseAggregatePaginate);

// create the model for HomePage and expose it to our app
module.exports = mongoose.model('HomePage', HomePageSchema);