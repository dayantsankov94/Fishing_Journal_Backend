const Publication = require('../models/Publication');
const Comment = require('../models/Comment');


exports.getAll = () => Publication.find().populate('owner');

exports.create = (publicationData) => Publication.create(publicationData);

exports.findById = (publicationId) => Publication.findById(publicationId).populate('owner')

exports.edit = (publicationId, publicationData) => Publication
    .findByIdAndUpdate(publicationId, publicationData, { new: true });

exports.remove = (publicationId) => Publication.findByIdAndDelete(publicationId);

// exports.edit = (publicationId, publicationData) => Publication
//     .findByIdAndUpdate(publicationId, publicationData, { new: true });

exports.addLike = (publicationId, userId,) => Publication
    .updateOne({ _id: publicationId }, { $push: { likes: userId } });

exports.addShare = (publicationId, userId) => Publication
    .updateOne({ _id: publicationId }, { $push: { shares: userId } });

exports.addOwner = (publicationId, userId,) => Publication
    .updateOne({ _id: publicationId }, { $push: { owner: userId } });


exports.addCommentToPublication = (publicationId, commentId,) => Publication
    .updateOne({ _id: publicationId }, { $push: { comments: commentId } });


exports.getAllComments = async (publicationId) => {
    const publication = await Publication.findById(publicationId);

    const commentsIds = publication.comments;
    return commentsIds;
};

exports.removeComment = async (publicationId, commentId) => {
    const publication = await Publication.findByIdAndUpdate(publicationId, { $pull: { comments: commentId } });

    return publication;
}


