const User = require("../models/User");

exports.getOne = (userId) => User.findById(userId);

exports.addPublication = async(userId, publicationId) => {
    publicationId = String(publicationId)
    
    const updated = await User.updateOne({ _id: userId }, { $push: { publications: publicationId } })
};


exports.removePublication = async ( userId,publicationId) => {
    const publication = await User.findByIdAndUpdate(userId, { $pull: { publications: publicationId } });

    return publication;
}