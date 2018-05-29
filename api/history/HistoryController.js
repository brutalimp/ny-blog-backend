var express = require('express');
var bodyParser = require('body-parser');
var role = require('../role');
var ViewHistory = require('./History');
var permit = require('../../middleware/Permission');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', permit(role.standard, role.admin), (req, res) => {
    ViewHistory.find({}, (err, historys) => {
        if (err) return res.status(500).send('There was a problem finding historys.');
        res.status(200).send(historys);
    })
});

router.delete('/:id', permit(role.standart, role.admin), (req, res) => {
    ViewHistory.findByIdAndRemove(req.params.id, (err, history) => {
        if (err) return res.status(500).send('There was a problem delete the history.');
        res.status(200).send('History ' + req.params.id + 'was deleted');
    })
});

module.exports = router;