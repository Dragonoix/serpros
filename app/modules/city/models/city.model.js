const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const citySchema = new Schema({
    region: { type: Schema.Types.ObjectId, ref: 'region', required: true },
    cityName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

citySchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('city', citySchema);