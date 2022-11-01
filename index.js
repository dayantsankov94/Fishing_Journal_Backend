const mongoose = require('mongoose');
const express = require('express');
const { mongoDbUrl } = require('./src/constants/urls');
const cors = require('./src/middlewares/cors');
const publicationController = require('./src/controllers/publicationController');
const authController = require('./src/controllers/authController');
const userController = require('./src/controllers/userController');
const cookieParser = require('cookie-parser');
const { auth } = require('./src/middlewares/authMiddleware');

async function start() {
    const PORT = process.env.PORT || 3030
    try {
        const db = await mongoose.connect(mongoDbUrl);
        console.log('DB is Ready!');
    } catch (error) {
        console.log('Error connection to DB!');
        return process.exit(1);
    }

    const app = express();

    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cors());
    app.use(auth)
    app.use('/publications',publicationController);
    app.use('/users',authController);
    app.use('/following',userController);


    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
}

start();