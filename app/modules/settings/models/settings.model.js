const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
    tax_percent: { type: Number, default: 0 },
    stripe_tax_charge_id: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, { timestamps: true, versionKey: false });


// create the model for settings and expose it to our app
module.exports = mongoose.model('settings', SettingsSchema);