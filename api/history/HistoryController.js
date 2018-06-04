var express = require('express');
var bodyParser = require('body-parser');
var role = require('../role');
var ViewHistory = require('./History');
var Article = require('../article/Article');
var permit = require('../../middleware/Permission');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', permit(role.standard, role.admin), (req, res) => {
    Article.find({
        owner: req.user._id
    }, '_id', (err, articles)=> {
        let articleIdList = [];
        for(let article of articles) {
                articleIdList.push(article._id.toString());
        }
        let startTime = Date.now() - 1000 * 60 * 60 * 24 * 30;
        ViewHistory.find({
            timestamp: { $gt: startTime },
            articleID: { $in: articleIdList }
        }, (err, historys) => {
            if (err) return res.status(500).send('There was a problem finding historys.');
            res.status(200).send(historys);
        })
    })
});

router.delete('/:id', permit(role.standart, role.admin), (req, res) => {
    ViewHistory.findByIdAndRemove(req.params.id, (err, history) => {
        if (err) return res.status(500).send('There was a problem delete the history.');
        res.status(200).send('History ' + req.params.id + 'was deleted');
    })
});

module.exports = router;