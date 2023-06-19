const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const skillSchema = new Schema({
    skill: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
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

skillSchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('skill', skillSchema);