const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const categorySchema = new Schema({
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    categoryName: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: "noImage.png"
    },
    banner :{
        type: String,
        default: "noImage.png"
    },
    description: {
        type: String, 
        default: ''
    },
    slug: {
        type: String, 
        default: ''
    },
    categoryType: {
        type: String,
        default: 'Service',
        enum: ['Service', 'Job', 'Blog']
    },
    level: {
        type: Number,
        required: true,
        default:0
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

categorySchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('categorymanagement', categorySchema);