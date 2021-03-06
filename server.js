var express = require('express'),
  app = express(),
  engine = require('ejs-blocks'),
  helmet = require('helmet'),
  session = require('express-session'),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  
  User    = require('./api/models/usersModel'), //created model loading here
  Compte  = require('./api/models/compteModel'),
  Rib     = require('./api/models/ribModel'),
  Carte   = require('./api/models/carteModel'),
  Transaction = require('./api/models/transactionModel'),

  bodyParser = require('body-parser'),
  session = require('client-sessions');

    //mongoose instance connection url connection
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://bokokvin:sylvestre96@ds261521.mlab.com:61521/zeyo'); 
    //mongoose.connect('mongodb://localhost/PaiementDB'); 


    app.engine('ejs', require('express-ejs-extend'));
    //app.engine('ejs', engine);
    //app.set('view engine', 'ejs');
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + '/public'));
    
    app.use(session({
      cookieName: 'session',
      secret: 'ISeeYouSoon',
      duration: 30 * 60 * 1000,
      activeDuration: 5 * 60 * 1000,
    }));
    
    app.use(function(req, res, next) {
      if (req.session && req.session.user) {
        User.findOne({ email: req.session.user.email })
            .populate('comptes')
            .exec(function (err, user) {

              if (user) {
                req.user = user;          //Récupérer l'utilisateur courant dans req.user
                delete req.user.password; // Supprimer le mot de passe de req.user
                req.session.user = user;  //rafraîchir la session (sans le mot de passe)
                res.locals.user = user;
              }

              next();
        });
  
      } else {
        next();
      }
    });

    var routes = require('./api/routes/routes'); //importing route
    routes(app); //register the route

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
      });


    app.listen(port);

    console.log('todo list RESTful API server started on: ' + port);