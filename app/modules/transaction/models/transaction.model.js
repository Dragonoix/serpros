const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const transactionSchema = new Schema({
    trans_date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    trans_id: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true
    },
    payer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    payee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'job',
        default: null
    },
    type: {
        type: String,
        default: null,
        enum: [null, 'subscription', 'milestone']
    },
    payout: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    subscriptionPlanId: {
        type: Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        default: null
    },
    description: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    paymentStatus: {
        type: String,
        default: 'succeeded',
        enum: ['succeeded', 'amount_capturable_updated', 'processing', 'payment_failed']
    },
    stripe_transactionId: {
        type: String, default: ''
    },
    stripe_subscriptionId: {
        type: String, default: ''
    },
    stripe_invoice_id: {
        type: String, default: ''
    },
    stripe_charge_id: {
        type: String, default: ''
    },
    stripe_refund_id: {
        type: String, default: ''
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive']
    }
}, {
    timestamps: true,
    versionKey: false
});

transactionSchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('transaction', transactionSchema);
