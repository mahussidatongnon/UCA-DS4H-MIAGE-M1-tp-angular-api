var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Student = require('../model/student');

router.get('/', async function (req, res) {
    if (req.query.all && req.query.all === "true") {
        Student.find({}, { password: 0 }, function (err, students) {
            if (err) return res.status(500).send("There was a problem finding the students.");
            res.status(200).send(students);
        });
        return;
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filtres
    let matchQuery = []

    if (req.query.name) {
        matchQuery.push({
            $match: {
                lastName: { $regex: new RegExp(req.query.nom, 'i') }
            }
        });
        matchQuery.push({
            $match: {
                firstName: { $regex: new RegExp(req.query.nom, 'i') }
            }
        });
    }

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