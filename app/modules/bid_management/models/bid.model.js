const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ['Accept', 'Decline', 'None'];

const BidSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, default:null , ref: 'jobs' },
    bidder_id: { type: Schema.Types.ObjectId, default:null , ref: 'User' },
    description: { type: String, default: '' },
    price_quote: { type: Number, default: '' },
    estimated_start_date: { type: Date, default:null },
    estimated_end_date: { type: Date, default:null },
    status: { type: String, default: 'None', enum: status },
	isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true });



// create the model for users and expose it to our app
module.exports = mongoose.model('Bid', BidSchema);