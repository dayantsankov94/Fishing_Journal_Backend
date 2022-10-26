const { validateToken } = require('../services/authService');

exports.auth = async (req, res, next) => {
    
    const token = req.headers['x-authorization'];

    
    

    if (token) {     
        try {
            const decodedToken = validateToken(token);
            
            req.user = decodedToken;
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid access token!' });
        }
    } else {
        next();
    }
};