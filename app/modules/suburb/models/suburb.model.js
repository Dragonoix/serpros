const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const suburbSchema = new Schema({
    region: { type: Schema.Types.ObjectId, ref: 'region', required: true },
    city: { type: Schema.Types.ObjectId, ref: 'city', required: true },
    suburbName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

suburbSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('suburb', suburbSchema);