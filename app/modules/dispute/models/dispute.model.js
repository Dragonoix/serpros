const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const DisputeSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, default: null , ref: 'job' },
    milestone_id: { type: Schema.Types.ObjectId, default: null , ref: 'milestone' },
	ticket_number: { type: Number, default: null },
    createdby_id: { type: Schema.Types.ObjectId, default:null, ref: 'User' },
    dispute: { type: String, default: '' },
    reply: { type: String, default: '' },
    seen: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ["Active","Inactive"] },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true });

// For pagination
DisputeSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Dispute', DisputeSchema);
