const router = require('express').Router();
const { isAuth, isGuest } = require('../middlewares/guards');
const authService = require('../services/authService');
const { errorMapper } = require('../utils/errorMapper');
const userService = require('../services/userService');
const { body, validationResult } = require('express-validator');


router.post('/register', isGuest,
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userData = req.body;


        if (userData.password === userData.repeatPassword) {
            try {
                const user = await authService.register({ ...userData });
                const result = await authService.createToken(user);
                // res.cookie('User', token, { httpOnly: true });
                res.status(201).json(result);
            } catch (error) {
                console.error(error);
                const message = errorMapper(error);
                res.status(400).json({ message });
            }
        } else {
            throw new Error('Passwords missmatch!');
        }
    });

router.post('/login', isGuest, async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await authService.login(email, password);
        const result = await authService.createToken(user);


        // res.cookie('User', token);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(400).json({ message });
    }
});

router.get('/logout', isAuth, (req, res) => {
    const token = req.cookies['User'];

    authService.logout(token);
    res.clearCookie('User'); ``
    res.json();
});


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getOne(id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        const message = errorMapper(error);
        res.status(404).json({ message });
    }
})


module.exports = router;