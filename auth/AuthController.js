var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../model/user');


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', function(req, res) {
  
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
   
    User.replaceOne(
        {name : req.body.username}, 
        {
            name : req.body.username, 
            // email : req.body.email, 
            role : "user", 
            password : hashedPassword
        }, 
        {upsert : false}, 
        function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });   

    // User.create({
    //   name : req.body.name,
    //   email : req.body.email,
    //   role : "admin",
    //   password : hashedPassword
    // },
    // function (err, user) {
    //   if (err) return res.status(500).send("There was a problem registering the user.")
    //   // create a token
    //   var token = jwt.sign({ id: user._id }, config.secret, {
    //     expiresIn: 86400 // expires in 24 hours
    //   });
    //   res.status(200).send({ auth: true, token: token });
    // }); 
});


router.get('/me', requireAuth, function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const userInfos = User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send({
            user: user,
            tokenInfos: {
                iat: decoded.iat,
                exp: decoded.exp
            }
        });
      });    
    });
});


router.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({login : username}, function (err, user) {
        if (err) return res.status(500).send({ auth: false, token: null, message: 'Error on the server.'});
        if (!user) return res.status(404).send({auth: false, token: null, message: 'No user found.'});
        
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: 'Wrong password.'});
        
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        
        res.status(200).send({ auth: true, token: token });
        }
    );
});


module.exports = router;