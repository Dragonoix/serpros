const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive']
    }
}, {
    timestamps: true,
    versionKey: false
})

testimonialSchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('testimonial', testimonialSchema);