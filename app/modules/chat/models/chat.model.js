const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


const ChatData = new Schema({
  from_id: { type: Schema.Types.ObjectId, default:null , ref: 'User' },
  room_id: { type: Schema.Types.ObjectId, default:null , ref: 'chatRoom' },
  text: { type: String , default: ''},
  files: { type: Array },
  reactions: { type: Array, default: []},
  type: { type: String, default:null, enum: ['file', 'text', 'typing']},
  isDeleted: { type: Boolean, default: false, enum: [true, false] },
  
},{versionKey:false,timestamps:true});


// create the model for users and expose it to our app
module.exports = mongoose.model('chat_data', ChatData);