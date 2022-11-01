const router = require('express').Router();
const userService = require('../services/userService');
const { isAuth } = require('../middlewares/guards');

router.post('/add/:id',
    isAuth,
    async (req, res) => {

        const followingId = req.params.id
        const userId = req.user._id;
        try {
            const result = await userService.addFollowing(userId, followingId);
            res.json(result);
        } catch (error) {
            console.error(error);
            const message = errorMapper(error);
            res.status(400).json({ message });
        }
    });

router.delete('/remove/:id',
    isAuth,
    async (req, res) => {

        const followingId = req.params.id
        const userId = req.user._id;
        try {
            const result = await userService.removeFollowing(userId, followingId);
            res.json(result);
        } catch (error) {
            console.error(error);
            const message = errorMapper(error);
            res.status(400).json({ message });
        }
    });

module.exports = router;