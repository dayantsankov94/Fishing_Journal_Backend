const User = require("../models/User");

exports.getOne = (userId) => User.findById(userId);

exports.addPublication = async(userId, publicationId) => {
    publicationId = String(publicationId)
    
    const updated = await User.updateOne({ _id: userId }, { $push: { publications: publicationId } })
    return updated;
};

exports.addShare = async(userId, publicationId) => {
    publicationId = String(publicationId)
    
    const updated = await User.updateOne({ _id: userId }, { $push: { shares: publicationId } })
    return updated;
};


exports.removePublication = async ( userId,publicationId) => {
    const publication = await User.findByIdAndUpdate(userId, { $pull: { publications: publicationId } });

    return publication;
}

exports.addFollowing = async(userId, followingId) => {
    
    const updated = await User.updateOne({ _id: userId }, { $push: { following: followingId } })
    return updated
};

exports.removeFollowing = async ( userId,followingId) => {
    const user = await User.findByIdAndUpdate(userId, { $pull: { following: followingId } });

    return user;
}