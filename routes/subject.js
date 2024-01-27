var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Subject = require('../model/subject');

router.get('/', function (req, res) {
    Subject.find({}).populate('professorIds').exec(function (err, professors) {
        if (err) {
            return res.status(500).send("There was a problem finding the professors." + err);
        }
        res.status(200).send(professors);
    });
});

module.exports = router;