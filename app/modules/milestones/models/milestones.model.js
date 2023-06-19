const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAggerigaate = require("mongoose-aggregate-paginate");

const milestone_status = ['Accept','Decline','Pending', 'Modify'];

const MilestoneSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, default:null, ref: 'job' },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    due_date: { type: Date, default: null },
    amount: { type: Number, default: 0 },
    created_by: { type: Schema.Types.ObjectId, default:null, ref: 'User' },
    milestone_status: { type: String, default: 'Pending', enum: milestone_status },
    job_submit_image: { type: Array, default: [] },
    job_submit_description: { type: String, default: null },
    job_submit_status: { type: Boolean, default: false, enum: [true, false] },
    job_submit_time: {type: Date, default: null},
    action_comment: { type: String, default: ''},
    status: { type: String, default: 'Active', enum: ["Active","Inactive"] },
    payment_status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed', 'Refunded'] },
    is_completed: { type: Boolean, default: false, enum: [true, false] },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
},{versionKey:false,timestamps:true});

//For pagigantation
MilestoneSchema.plugin(mongooseAggerigaate);

//create model for brands and expose it to our app
module.exports=mongoose.model("Milestone",MilestoneSchema);