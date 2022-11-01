const { model, Schema, Types } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        min: [8, 'Password should be at least 8 symbols!']
    },
    imageUrl: {
        type: String,
        required: true,
    },
    publications: [{
        type: Types.ObjectId,
        ref: 'Publication',
    }],
    shares: [{
        type: Types.ObjectId,
        ref: 'Publication',
    }],
    following: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
});

userSchema.index({ email: 1 }, {
    collation: {
        locale: 'en',
        strength: 1
    }
});

const User = model('User', userSchema);

module.exports = User;