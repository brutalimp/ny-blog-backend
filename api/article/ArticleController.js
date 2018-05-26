var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var config = require('../../config/auth.config');
var Article = require('./Article');
var User = require('../user/User');
var role = require('../role');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {

    Article.create({
        name: req.body.name,
        owner: req.user._id,
        filename: req.body.filename,
        content: req.body.content,
        public: req.body.public,
        timestamp: Date.now()
    }, (err, article) => {
        if (err) return res.status(500).send('There was a problem adding a article into the database.');
        res.status(200).send(article);
    })
})

router.get('/', (req, res) => {
    var token = req.headers['authorization'];
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(decoded.id,
            { password: 0 }, // projection
            (err, user) => {
                if (err) return res.status(501).send("Error occured.");
                Article.find({ owner: user._id }, { content: 0 }, (err, articles) => {
                    if (err) return res.status(500).send('There was a problem finding the articles.');
                    res.status(200).send(articles);
                });
            });
    })
})

router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(500).send("There was a problem finding the article.");
        if (!article) return res.status(404).send("No article found.");
        res.status(200).send(article);
    })
})

router.delete('/:id', (req, res) => {
    Article.findByIdAndRemove(req.params.id, function (err, article) {
        if (err) return res.status(500).send("There was a problem deleting the article.");
        if (!article) return res.status(404).send("Article is not found.")
        res.status(200).send("article " + article.name + " was deleted.");
    });
});

router.put('/:id', (req, res) => {
    Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, article) {
        if (err) return res.status(500).send("There was a problem updating the article.");
        res.status(200).send(article);
    });
});

module.exports = router;
