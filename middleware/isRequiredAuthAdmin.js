const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/user');

const isRequiredAuthAdmin = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(decoded.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (user.role!=="admin") return res.status(403).send({ auth: false, message: "You don't have permission to access this resource."});
            next();
        });
    });
};

module.exports = isRequiredAuthAdmin;