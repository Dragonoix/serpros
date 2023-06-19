const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const regionSchema = new Schema({
    regionName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

regionSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('region', regionSchema);