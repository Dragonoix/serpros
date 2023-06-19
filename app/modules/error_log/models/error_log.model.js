const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ['Active', 'Inactive'];

const ErrorLogSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  api_url: { type: String, default: '' },
  error_msg: { type: String, default: '' },
  status: { type: String, default: 'Active', enum: status },
  isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true, versionKey: false });

// For pagination
ErrorLogSchema.plugin(mongooseAggregatePaginate);

// create the model for Shop and expose it to our app
module.exports = mongoose.model('Error_log', ErrorLogSchema);