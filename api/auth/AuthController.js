var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Response = require('../response');
var role = require('../role');
var logger = require('../../helper/logger');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/auth.config');

router.post('/register', (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        password: hashedPassword,
        role: role.standard,
        timestamp: Date.now()
    }, (err, user) => {
        if (err) return res.status(500).send('There was a problem registering the user.');
        var token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
        logger.info(`new user registered. name is ${user.name}`)
        res.status(200).send({ token });
    });
})

router.get('/me', (req, res) => {
    if(!req.user) return res.status(401).send('Token is invalid.');
    return res.status(200).send(req.user);
});

router.post('/login', (req, res) => {
    User.findOne({ name: req.body.name }, function (err, user) {
        if (err) return res.status(500).send( 'Error on the server.');
        if (!user) return res.status(404).send( 'No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) return res.status(401).send('Password invalid');
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({token: token });
    });
});

router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;