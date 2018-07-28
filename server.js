var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  
  User    = require('./api/models/usersModel'), //created model loading here
  Compte  = require('./api/models/compteModel'),
  Rib     = require('./api/models/ribModel'),
  Carte   = require('./api/models/carteModel'),

  bodyParser = require('body-parser'),
  session = require('client-sessions');

  // mongoose instance connection url connection
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/PaiementDB'); 


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    app.use(session({
      cookieName: 'session',
      secret: 'random_string_goes_here',
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