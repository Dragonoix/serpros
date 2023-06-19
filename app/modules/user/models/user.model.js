const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');

const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const registerType = ['Normal', 'Google', 'Facebook'];
const user_types = ['admin', 'client', 'service_provider'];
const bools = [true, false];
const scopetype = ['individual', 'business']

const UserSchema = new Schema({
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  full_name: { type: String, default: '' },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  scope_type: { type: String, default: 'individual', enum: scopetype },
  user_type: { type: String, default: 'client', enum: user_types },
  company_name: { type: String, default: '' },
  company_detail: { type: String, default: '' },
  company_logo: { type: String, default: '' },
  category: [{ type: Schema.Types.ObjectId, ref: 'categorymanagement', default: null }],
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  company_users: [{ role: { type: String, default: '' }, email: { type: String, default: '' } }],
  geo_loc: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  location: { type: String, default: '' },
  curr_symbol: { type: String, default: '' },
  job_title: { type: String, default: '' },
  website_link: { type: String, default: '' },
  skills: [{ type: Schema.Types.ObjectId, ref: 'skill', default: null }],
  cityName: { type: String, default: '' },
  stateName: { type: String, default: '' },
  countryName: { type: String, default: '' },
  rate_per_hr: { type: Number, default: 0 },
  servicing_region: { type: Schema.Types.ObjectId, ref: 'region' },
  servicing_city: { type: Schema.Types.ObjectId, ref: 'city' },
  servicing_suburbs: { type: [{ type: Schema.Types.ObjectId, ref: 'suburbs' }], default: [] },
  zipCode: { type: String, default: '' },
  currency: { type: String, default: '' },
  password: { type: String, default: '' },
  bio: { type: String, default: '' },
  profile_image: { type: String, default: 'noImage.png' },
  cover_image: { type: String, default: 'noImage.png' },
  registerType: { type: String, default: 'Normal', enum: registerType },
  socialAccount: [{
    socialId: { type: String, default: '' },
    platform: { type: String, default: 'Google', enum: ["Google", 'Facebook'] },
  }],

  // user settings start
  availabilities: {
    monday: { type: Boolean, default: false, enum: [true, false] },
    tuesday:{ type: Boolean, default: false, enum: [true, false] },
    wednesday:{ type: Boolean, default: false, enum: [true, false] },
    thursday:{ type: Boolean, default: false, enum: [true, false] },
    friday:{ type: Boolean, default: false, enum: [true, false] },
    saturday:{ type: Boolean, default: false, enum: [true, false] },
    sunday:{ type: Boolean, default: false, enum: [true, false] },
  }, // availabilities

  transactional_email_preference: { type: String, default: 'important', enum: ['intresting', 'important', 'essential'] }, // notification
  project_notification_preference: {
    saved_search: { type: Boolean, default: false, enum: [true, false] },
    project_invitation: { type: Boolean, default: false, enum: [true, false] },
    project_recommendation: { type: Boolean, default: false, enum: [true, false] },
  }, //notification
  marketing_email_preference: {
    daily_offers: { type: Boolean, default: false, enum: [true, false] },
    newsletter: { type: Boolean, default: false, enum: [true, false] },
    promotions: { type: Boolean, default: false, enum: [true, false] },
    product_updates: { type: Boolean, default: false, enum: [true, false] },
    survey: { type: Boolean, default: false, enum: [true, false] },
  }, //notification
  enable_sms_update: { type: Boolean, default: false, enum: [true, false] }, //notification
  sound_alerts: { type: Boolean, default: true, enum: [true, false] }, //notification

  billing_info: {
    vat_registered: { type: String, default: 'no', enum: ['yes', 'no'] },
    vat_registration_number: { type: String, default: '' },
    company_registration_number: { type: String, default: '' },
    name: { type: String, default: '' },
    address1: { type: String, default: '' },
    address2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zip_code: { type: String, default: '' },
    phone: { type: String, default: '' },
    fax: { type: String, default: '' }
  }, //billing_info
  default_currency: { type: String, default: 'USD' },

  personal_url: { type: String, default: '' },
  // user settings end

  deviceToken: { type: String, default: '' },
  deviceType: { type: String, default: '' },
  time_zone: { type: String, default: '' },
  stripeCustomerId: { type: String, default: '' },
  availability: { type: Array, default: [] },
  isOnline: { type: Boolean, default: false, enum: bools },
  isPaymentCompleted: { type: Boolean, default: false, enum: bools },
  isDeleted: { type: Boolean, default: false, enum: bools },
  status: { type: String, default: 'Active', enum: ['Active', 'Inactive', 'Banned'] },
  portfolio_description: { type: String, default: '' },
  invoked_by: { type: String, default: 'self', enum: ['self', 'admin'] }
}, { timestamps: true, versionKey: false });


//geo location indexing
UserSchema.index({ geo_loc: "2dsphere" });

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
};

UserSchema.virtual('userdevices', {
  ref: 'user_devices',
  localField: '_id',
  foreignField: 'userId'
});

// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for User and expose it to our app
module.exports = mongoose.model('User', UserSchema);