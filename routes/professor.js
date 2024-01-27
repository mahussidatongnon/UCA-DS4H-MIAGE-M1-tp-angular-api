var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Professor = require('../model/professor');

router.get('/',function (req, res) {
    Professor.find({}).populate('userId').exec(function (err, professors) {
        if (err) {
            return res.status(500).send("There was a problem finding the professors.");
        }
        res.status(200).send(professors);
    });
});

module.exports = router;