const { model, Schema, Types } = require('mongoose');

const publicationSchema = new Schema({
    fishType: {
        type: String,
        required: true,
    },

    weight: {
        type: Number,
        required: true,
        min: 0
    },

    place: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    catchingMethod: {
        type: String,
        required: true,
    },

    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },

    likes: [{
        type: Types.ObjectId,
        ref: 'User',
    }],

    shares: [{
        type: Types.ObjectId,
        ref: 'User',
    }],

    comments: [{
        type: Types.ObjectId,
        ref: 'Comment',
    }],
});

const Publication = model('Publication', publicationSchema);

module.exports = Publication;