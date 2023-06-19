const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const bools = [true, false];

const PortfolioSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    files: { type: Array, default: [] },
    text: { type: String, default:''},
    // mime_type: { type: String, default: '' },
    isDeleted: {type: Boolean, default: false, enum: bools}
}, { timestamps: true, versionKey: false });

// For pagination
PortfolioSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('portfolio', PortfolioSchema);