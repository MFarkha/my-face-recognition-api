const { getAuthTokenId } = require('./signin');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unathorized');
    }
    const token = authorization.split(' ')[1];
    return getAuthTokenId(token)
        .then(id => {
            if (id) {
                if (process.env.APP_DEBUG) {
                    console.log('id received over auth process: ', id);
                }
                return next();
            } else {
                return res.status(401).json('Unathorized');
            }
        })
        .catch(err => {
            if (process.env.APP_DEBUG) {
                console.log('Error receiving a token from redis: ', err);
            }
            return res.status(401).json('Unathorized');
        })
}

module.exports = {
    requireAuth
}