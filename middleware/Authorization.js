var jwt = require('jsonwebtoken');
var config = require('../config/auth.config');
var User = require('../api/user/User')

function Authorization(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        next();
    } else {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return next();
            User.findById(decoded.id,
                { password: 0 }, // projection
                (err, user) => {
                    if (!err && user) {
                        req.user = user;
                    }
                    next();
                });
        })
    };
}

module.exports = Authorization;