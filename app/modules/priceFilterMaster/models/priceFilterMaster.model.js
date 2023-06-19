const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const priceFilterMasterSchema = new Schema({
    greater_than: { type: Number, default: null },
    less_than: { type: Number, default: null },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

priceFilterMasterSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('priceFilterMaster', priceFilterMasterSchema);