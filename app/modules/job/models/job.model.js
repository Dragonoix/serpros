const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const jobSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    email: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'categorymanagement', default: null },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    postDate: { type: Date, default: Date.now() },
    location: { type: String, default: '' },

    files: { type: Array, default: [] },
    description_attachment: { type: Array, default: [] },

    region: { type: Schema.Types.ObjectId, ref: 'region', default: null },
    district: { type: Schema.Types.ObjectId, ref: 'city', default: null },
    suburb: { type: Schema.Types.ObjectId, ref: 'suburb', default: null },
    budget: { type: Number, default: 0},
    deadline: { type: Date, default: null},
    openForBid: { type: Boolean, default: true, enum: [true, false] },
    is_completed: { type: Boolean, default: false, enum: [true, false] },
    notified: { type: Boolean, default: false, enum: [true, false] },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] }
}, {
    timestamps: true,
    versionKey: false 
})

jobSchema.plugin(mongooseAggregatePaginate);
module.exports = new mongoose.model('job', jobSchema);