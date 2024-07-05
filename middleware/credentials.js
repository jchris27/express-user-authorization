const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        // set the access control allow credential in the header
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;