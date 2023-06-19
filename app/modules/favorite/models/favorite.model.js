const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const favoriteSchema = new Schema ({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    servicer_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
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

favoriteSchema.plugin(mongooseAggregatePaginate);

module.exports = new mongoose.model('favorite', favoriteSchema);
