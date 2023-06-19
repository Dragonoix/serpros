const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    room_image: { type: String, default: 'noImage.png' },
    job_id: { type: Schema.Types.ObjectId, ref: 'job' },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    unseen_count: [{user_id: { type: Schema.Types.ObjectId, ref: 'User' }, count: { type: Number, default: 0 }} ],
    notepad:  [{user_id: { type: Schema.Types.ObjectId, ref: 'User' }, notes: { type: String, default: "" }} ],
    created_on: { type: Date, default: new Date() },
    last_message_text: { type: String, default: '' },
    last_message_at: { type: Date, default: new Date() },
    last_message_by: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
    status: { type: Boolean, default: true, enum: [true, false] },
}, { timestamps: true, versionKey: false });


// create the model for socket_chat and expose it to our app
module.exports = mongoose.model('chatRoom', ChatRoomSchema);
