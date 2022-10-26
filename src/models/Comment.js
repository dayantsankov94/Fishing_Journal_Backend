const { model, Schema, Types } = require('mongoose');

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    publication: {
        type: Types.ObjectId,
        ref: 'Publication',
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;