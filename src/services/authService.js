const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET } = require('../constants/others');

const blacklisted = new Set();

exports.register = async (userData) => {
    const existing = await User.findOne({ email: new RegExp(`^${userData.email}$`, 'i') });

    if (existing) {
        throw new Error('User with this email is already existing!');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    return User.create(userData);
};

exports.login = async (email, password) => {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!user) {
        throw new Error('Incorrect email or password!');
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Incorrect email or password!');
    }
    return user;
};

exports.createToken = async (user) => {
    const payload = { _id: user._id, name: user.name, username: user.username };
    const options = { expiresIn: '2d' };
    const userWithoutPass = {
        _id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl,
        publications: user.publications,
        shares: user.shares,
        following: user.following
    }


    const token = await jwt.sign(payload, SECRET, options);
    return {
        token,
        userWithoutPass
    }
};

exports.logout = (token) => {
    blacklisted.add(token);
}

exports.validateToken = (token) => {
    if (blacklisted.has(token)) {
        throw new Error('This token is blacklisted!');
    }

    return jwt.verify(token, SECRET)

}