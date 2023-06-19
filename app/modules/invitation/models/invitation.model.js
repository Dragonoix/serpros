const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const invitationSchema = new Schema({ 
    invitation_from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invitation_to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: Schema.Types.ObjectId, ref: 'job', required: true },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false
})

invitationSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('invitation', invitationSchema);