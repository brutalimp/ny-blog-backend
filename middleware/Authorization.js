var jwt = require('jsonwebtoken');
var config = require('../config/auth.config');
var User = require('../api/user/User')

function Authorization(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        // return res.status(401).send({ auth: false, message: 'No token provided.' })
        next();
    } else {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                // return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                next();
            User.findById(decoded.id,
                { password: 0 }, // projection
                (err, user) => {
                    if (err) return res.status(500).send("There was a problem finding the user.");
                    if (!user) return res.status(404).send("No user found.");
                    req.user = user;
                    next();
                });
        })
    };
}

module.exports = Authorization;