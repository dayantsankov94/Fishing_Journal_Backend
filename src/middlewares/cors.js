module.exports = () => (req, res, next) => {

    const corsWhitelist = [
        'http://localhost:3000',
        'https://fishing-journal-214c0.web.app',
        'https://fishing-journal-214c0.firebaseapp.com'
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,HEAD,OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type ,Origin ,accept ,X-Authorization ,Authorization ');

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
};

