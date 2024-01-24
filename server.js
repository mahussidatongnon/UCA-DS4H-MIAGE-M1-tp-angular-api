let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const requireAuth = require('./middleware/requireAuth');
const isRequiredAuthAdmin = require('./middleware/isRequiredAuthAdmin');

//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://mahussidatongnon:sad3sDrvWjQpUdsf@cluster0.5qdgktc.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// Assignments routes
app.route(prefix + '/assignments')
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(isRequiredAuthAdmin, assignment.getAssignment)
  .delete(isRequiredAuthAdmin, assignment.deleteAssignment);


app.route(prefix + '/assignments')
  .post(isRequiredAuthAdmin, assignment.postAssignment)
  .put(isRequiredAuthAdmin, assignment.updateAssignment);

// Users routes
var UserController = require('./routes/user');
// app.use( prefix + '/users', UserController);
app.use( prefix + '/users', isRequiredAuthAdmin, UserController);


// Authentification
var AuthController = require('./auth/AuthController');
app.use( prefix + '/auth', AuthController);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


