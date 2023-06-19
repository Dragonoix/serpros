const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const ReviewSchema = new Schema({
	review_for_user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	review_by_user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	job_id: { type: Schema.Types.ObjectId, default: null , ref: 'job' },
	workmanship : { type: Number, default: 0 },
	cost : { type: Number, default: 0 },
	schedule : { type: Number, default: 0 },
	communication : { type: Number, default: 0 },
	average : { type: Number, default: 0 },
	review : { type: String, default:'' },
	review_date: { type: Date, default: Date.now() },
	isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true });

// For pagination
ReviewSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Review', ReviewSchema);
