const publicationServices = require('../services/publicationService');

exports.isAuth = (req, res, next) => {
    
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Please log in' });
    }
};

exports.isGuest = (req, res, next) => {
    
    if (!req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Please logout' });
    }
};

exports.isOwner = async (req, res, next) => {
    const id = req.params.id;

    const publication = await publicationServices.findById(id);

    const isOwner = req.user._id == String(publication.owner._id);
    
    if (!isOwner) {
        return res.status(403).json({ message: 'You are not authorized to edit this publication' });
    }

    next();
};