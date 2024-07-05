// put your domain here/web application domain to access the backend that will allow the cors to access. remove localhost if not in dev mode
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { //during development add !origin is equivalient to undefined
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        };
    },
    corsOptionsStatus: 200
};

module.exports = corsOptions;