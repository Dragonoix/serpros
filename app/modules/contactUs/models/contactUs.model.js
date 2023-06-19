const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const contactUsSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
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
});

contactUsSchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('contact-us', contactUsSchema);
