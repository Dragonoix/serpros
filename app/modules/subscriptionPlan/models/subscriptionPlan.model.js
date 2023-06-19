const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const SubscriptionPlanSchema = new Schema({

    plan_name: { type: String, default: '' },
    bill_frequency: { type: String, default: "month", enum: ["year", "month", "quarter"] },
    price_per_user: { type: Number, default: 0 },
    plan_duration: { type: Number, default: 0},
    handling_fee: { type: Number, default: 0},
    team_size: { type: Number, default:0},

    isDeleted: {type: Boolean, default: false, enum: [true, false]}
}, { timestamps: true, versionKey: false });

// For pagination
SubscriptionPlanSchema.plugin(mongooseAggregatePaginate);

// create the model for SubscriptionPlan and expose it to our app
module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);