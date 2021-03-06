var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var config = require('../../config/auth.config');
var permit = require('../../middleware/Permission');
var Article = require('./Article');
var ViewHistory = require('../history/History');
var User = require('../user/User');
var role = require('../role');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', permit(role.admin, role.standard), (req, res) => {
    Article.create({
        name: req.body.name,
        owner: req.user._id,
        filename: req.body.filename,
        content: req.body.content,
        public: req.body.public,
        type: req.body.type,
        timestamp: Date.now()
    }, (err, article) => {
        if (err) return res.status(500).send('There was a problem adding a article into the database.');
        res.status(200).send(article);
    })
})

router.get('/', (req, res) => {
    if (!req.user) {
        Article.find({ public: true }, { content: 0 }, (err, articles) => {
            if (err) return res.status(500).send('There was a problem finding the articles.');
            res.status(200).send(articles);
        })
    } else {
        Article.find({ owner: req.user._id }, { content: 0 }, (err, articles) => {
            if (err) return res.status(500).send('There was a problem finding the articles.');
            res.status(200).send(articles);
        });
    };
})

router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(500).send("There was a problem finding the article.");
        if (!article) return res.status(404).send("No article found.");
        if (!article.public && (!req.user || req.user._id.toString() !== article.owner)) {
            return res.status(403).send("Forbidden.");
        };
        // create a history record just when anonymous or no author viewer visits
        if (!req.user || req.user._id.toString() !== article.owner) {
            // anonymous id is 404
            var viewerID = 404;
            if (req.user) {
                viewerID = req.user._id;
            };
            ViewHistory.create({
                articleID: article._id,
                viewerID,
                os: req.headers['user-agent'],
                timestamp: Date.now()
            });
        }
        res.status(200).send(article);
    })
})

router.delete('/:id', permit(role.admin, role.standard), (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(500).send("There was a problem finding the article.");
        if (!article) return res.status(404).send("Article is already deleted.");
        if (article.owner !== req.user._id.toString()) return res.status(401).send('Forbidden.');
        Article.deleteOne({ _id: req.params.id }, (err, article) => {
            if (err) return res.status(500).send("There was a error deleting the article.");
            return res.status(200).send(article);
        })
    })
});

router.put('/permission/:id', (req, res) => {
    Article.findByIdAndUpdate(req.params.id, { public: req.body.permission }, { new: true }, function (err, article) {
        if (err) return res.status(500).send("There was a problem updating the permission.");
        res.status(200).send(article);
    });
})

router.put('/:id', permit(role.admin, role.standard), (req, res) => {
    Article.findByIdAndUpdate(req.params.id, { name: req.body.name, content: req.body.content, public: req.body.public }, { new: true }, function (err, article) {
        if (err) return res.status(500).send("There was a problem updating the article.");
        res.status(200).send(article);
    });
});

module.exports = router;
