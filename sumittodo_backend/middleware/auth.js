const {users} = require('../models/user.model');
const {decode} = require('../utils/crypto/jwt.util');
const {response, handleError, MongooseErrorHandle} = require('../utils/response.util');

function validate(req, res, next) {
    /** Fetching details */
    let token = req.header('Authorization');
    
    if (!token) {
        return response(403, 'token is missing', res)
    }
     
    /** Decoding JWT */
    decode(token).then((payload) => {

        users.findById(payload.user_id, '-__v -password').exec((err, doc) => {
            if (err) {
                return MongooseErrorHandle(err, res)
            }

            if (!doc) {
                return response(403, `Forbidden - You don't have enough permission to access this resource`, res)
            }

            if (doc.is_removed) {
                return response(403, `Account removed - current account has been removed`, res)
            }

            req.user = doc;
            return next()
        })

    }).catch((err) => {
        return response(403, `Either the token is tampered or the session has been expired`, res)
    })
}

module.exports = {validate};
