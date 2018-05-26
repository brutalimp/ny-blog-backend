var express = require('express');
var bodyParser = require('body-parser');
var Article = require('../article/Article');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/article', (req, res) => {
    Article.find({}, { content: 0 }, (err, articles) => {
        if (err) return res.status(500).send('There was a problem finding the articles.');
        res.status(200).send(articles);
    });
});

router.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(500).send("There was a problem finding the article.");
        if (!article) return res.status(404).send("No article found.");
        res.status(200).send(article);
    });
})

module.exports = router;