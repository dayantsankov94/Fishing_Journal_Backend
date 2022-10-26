const router = require('express').Router();

const publicationServices = require('../services/publicationService');
const { errorMapper } = require('../utils/errorMapper');
const userService = require('../services/userService');
const commentService = require('../services/commentService');
const { isAuth, isOwner } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const publications =await publicationServices.getAll();    
        res.json(publications);
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});


router.post('/create',
    isAuth,
    async (req, res) => {

        const publicationData = { ...req.body }
        const userId = req.user._id;
        publicationData.owner = userId
        try {
            const result = await publicationServices.create(publicationData, userId);
            await userService.addPublication(userId, result._id);
            res.json(result);
        } catch (error) {
            console.error(error);
            const message = errorMapper(error);
            res.status(400).json({ message });
        }
    });

router.get('/details/:id', async (req, res) => {
    const id = req.params.id;

    const publication = await publicationServices.findById(id);

    if (publication) {
        res.json(publication);
    } else {
        res.status(404).json({ message: 'Publication not found' });
    }
});

router.put('/details/edit/:id',
    isAuth,
    isOwner,
    async (req, res) => {

        if (Number(req.body.weight) <= 0) {
            return res.status(400).json({ message: 'Weight value must be higher than 0!' });
        }


        const id = req.params.id;

        const publicationData = { ...req.body };

      

        try {
            const updatedPublication = await publicationServices.edit(id, publicationData)
            res.json(updatedPublication);
        } catch (error) {
            console.error(error);
            const message = errorMapper(error);
            res.status(400).json({ message });
        }
    });

router.delete('/details/delete/:id', isAuth, isOwner, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    try {
        const deleted = await publicationServices.remove(id);
        await userService.removePublication(userId,id)
        res.json(deleted);
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(404).json({ message });
    }
});


router.post('/details/:id/like', isAuth, async (req, res) => {
    const publicationId = req.params.id;
    const userId = req.user._id;

    try {
        const like = await publicationServices.addLike(publicationId, userId);
        res.status(201).json(like);
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});

router.post('/details/:id/share', isAuth, async (req, res) => {
    const publicationId = req.params.id;
    const userId = req.user._id;

    try {
        const share = await publicationServices.addShare(publicationId, userId);
        res.status(201).json(share);
    } catch (error) {
        console.error(error);

        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});
router.post('/details/:id/comment', isAuth, async (req, res) => {
    const publicationId = req.params.id;
    const data = req.body;
    const text = data.text
    const userId = req.user._id;
    const commentData = {
        text: text,
        publication: publicationId,
        owner: userId
    };

    try {
        const comment = await commentService.addComment(commentData);
        await publicationServices.addCommentToPublication(publicationId, comment._id)

        res.status(201).json(comment)
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});

router.delete('/details/:id/comment', isAuth, async (req, res) => {
    const commentId = req.body;
    const publicationId = req.params.id;

    try {
        const remove = await publicationServices.removeComment(publicationId, commentId._id)
        const comment = await commentService.deleteComment(commentId._id);
        const publication = await publicationServices.findById(publicationId)
        res.status(200).json(publication)
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});

router.get('/details/:id/comments', async (req, res) => {
    const publicationId = req.params.id;
    let comments = [];
    let promises = [];
    try {
        const commentsIds = await publicationServices.getAllComments(publicationId);
        commentsIds.forEach((x) => {
            const id = String(x);
            const promise = commentService.getById(id).populate('owner');

            promises.push(promise);
        })
        Promise.allSettled(promises)
            .then(result => {
                result.map(x => comments.push(x.value));
                res.status(200).json(comments);
            });
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(404).json({ message });
    }
});

module.exports = router;