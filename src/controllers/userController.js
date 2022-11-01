const userService = require('../services/userService');

router.post('/add',
    isAuth,
    async (req, res) => {

        const followingId = req.body
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

router.delete('/remove',
    isAuth,
    async (req, res) => {

        const followingId = req.body
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