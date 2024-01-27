var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Student = require('../model/student');

router.get('/', async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const options = {
            page: page,
            limit: limit
        };

        const result = await Student.aggregatePaginate([], options); // Utilisez aggregatePaginate avec les options

        // Utilisez populate pour charger les informations utilisateur
        await Student.populate(result.docs, { path: 'userId' });

        res.status(200).send(result);
    } catch (error) {
        console.error("Error finding students:", error);
        res.status(500).send("There was a problem finding the students." + error);
    }
});

module.exports = router;