var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../model/user');

// CREATES A NEW USER
router.post('/', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name : req.body.name,
            // email : req.body.email,
            role : req.body.role,
            password : hashedPassword
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async function (req, res) {
    // User.find({}, { password: 0 }, function (err, users) {
    //     if (err) return res.status(500).send("There was a problem finding the users.");
    //     res.status(200).send(users);
    // });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const options = {
            page: page,
            limit: limit
        };

        const result = await User.aggregatePaginate([], options); // Utilisez aggregatePaginate avec les options

        res.status(200).send(result);
    } catch (error) {
        console.error("Error finding assignments:", error);
        res.status(500).send("There was a problem finding the assignments." + error);
    }
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;