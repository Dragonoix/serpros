const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const proposalSchema = new Schema({ 
    proposal_from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rate: { type: Number, default: 0 },
    estimated_days: { type: Number, default: 0 },
    description: { type: String, required: true },
    image: [{ type: String}],
    job_id: { type: Schema.Types.ObjectId, ref: 'job', required: true },
    proposal_status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

proposalSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('proposal', proposalSchema);