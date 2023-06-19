const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAggerigaate = require("mongoose-aggregate-paginate");


const type = ['milestone', 'job', 'proposal', null];
const subType = [ 'complete', 'pending', 'payment', 'newJob',  null ]

const NotificationSchema = new Schema({
    from_user_id: { type: Schema.Types.ObjectId, default:null ,ref: 'User' },
    to_user_id: { type: Schema.Types.ObjectId, default:null ,ref: 'User' },
    notification_against: { data: { type: String, default: null },value: { type: Schema.Types.ObjectId, default: null } },
    notification_message: { type: String, default: '' },
    type: { type: String, default: null, enum: type },
    sub_type: { type: String, default: null, enum: subType },
    status: { type: String, default: 'Active', enum: ["Active","Inactive"] },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    seen: { type: Boolean, default: false, enum: [true, false] },
},{versionKey:false,timestamps:true});

//For pagigantation
NotificationSchema.plugin(mongooseAggerigaate);

//create model for brands and expose it to our app
module.exports=mongoose.model("Notification",NotificationSchema);