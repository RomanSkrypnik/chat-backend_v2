const ApiException = require('../exceptions/api.exception');

module.exports = (err, req, res, next) => {
    if (err instanceof ApiException) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }

    if (process.env.APP_DEBUG) {
        console.log(err);
    }

    return res.status(500).json({message: 'Server error'});
};
