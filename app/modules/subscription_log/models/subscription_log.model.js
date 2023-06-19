const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const status = ['Active', 'Inactive'];
const trans_type = ['New', 'Renew', 'Switch'];

const SubscriptionLogSchema = new Schema({
  amount: { type: Number, default: 0 },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscription_plan_id: { type: mongoose.Types.ObjectId, ref: 'Subscription_plan' },
  stripe_subscription_id: { type: String, default:'' },

  charge_id: { type: String, default:'' },
  period_start: {type: Number, default:0},
  period_end: {type: Number, default:0},
  current_period_start_date: {type: Date, default:Date.now},
  current_period_end_date: {type: Date, default:Date.now},
  subscription_start_date: {type: Date, default:Date.now},
  subscription_end_date: {type: Date, default:null},
  trans_type: { type: String, default: 'New', enum: trans_type },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'canceled'] },
}, { timestamps: true, versionKey: false });

// For pagination
SubscriptionLogSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Subscription_log', SubscriptionLogSchema);