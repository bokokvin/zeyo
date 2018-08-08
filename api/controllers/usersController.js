'use strict';

const url = require('url');
var moment = require('moment');
var plotly = require('plotly')("bokokvin", "R8Qq4jDDwQsR1lpzfv9S");

var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Compte = mongoose.model('Compte'),
    Rib = mongoose.model('Rib'),
    Transaction = mongoose.model('Transaction'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');
    

// Affiche le formulaire d'inscription
exports.register_form = function(req, res) {
      res.render('inscription.ejs', { error: "", req: req, users:'' } );  
};

// Affiche le formulaire d'inscription pour un pro
exports.register_form_pro = function(req, res) {
  res.render('');  
};

// Affiche le formulaire de connexion
exports.login_form = function(req, res) {
  res.render('connexion.ejs', { error: "", req: req, users:'' });  
};

// Affiche la page d'accueil en lui passant les données de l'utilisateur courant
exports.home = function(req, res) { 

  if (req.session.user)
  {
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
      res.render('home.ejs',{users: User, req: req });
    })
      
  }
  else {
    res.render('home.ejs',{ req: req, users:'' });
  }
};

// Supprime les données de session, déconnecte l'utilisateur et le redirige vers la page de connexion
exports.logout = function(req, res) {
  req.session.reset();
  res.redirect('/home');
};

// Verifie que l'utilisateur est connecté sinon le redirige vers la page de connexion
exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

// Affiche les transactions d'un utilisateur
exports.transaction_all_by_user = function(req, res){

  Transaction
  .find({ $or:[ { sender : req.session.user._id} ,{ receiver : req.session.user._id} ]})
  .populate('receiver')
  .exec(function (err, transaction) {
      if (err) return handleError(err);

      var date = [];
      transaction.forEach(function(transac) {  
        date.push(transac.date)
      });

      var montant = [];
      transaction.forEach(function(transac) {  
        montant.push(transac.montant)
      });


      var data = [
        {
          x: date,
          y: montant,
          type: "scatter"
        }
      ];
      var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
      
      plotly.plot(data, graphOptions, function (err, msg) {
          console.log(msg);
      });

      
      
      res.render('transaction_list.ejs', {transaction: transaction, moment: moment})
  });
}



// Crée un nouvel utilisateur et un nouveau compte qui lui est associé, redirige vers la page de connexion
exports.create_a_user = function(req, res) {
 var hashedPassword = bcrypt.hashSync(req.body.mdp, 8);
  
  var bob = new User({
    nom : req.body.nom,
    prenom : req.body.prenom,
    email : req.body.email,
    age : req.body.age,
    numero : req.body.numero,
    mdp : hashedPassword,
  });
  
  bob.save(function(err, bob) {
    if (err) res.send(err);
    
    var compte = new Compte({
      user: bob._id 
    });

    compte.save(function (err) {
      if (err) return handleError(err);

      bob.comptes.push(compte);
      bob.save(function(err){});

    });

    res.redirect('/login');
});
};


// Crée un utilisateur pro, un nouveau compte et un nouveau Rib qui lui sont associés, redirige vers la page de connexion
exports.create_a_high_user = function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.mdp, 8);
   
   var bob = new User({
     nom : req.body.nom,
     prenom : req.body.prenom,
     email : req.body.email,
     age : req.body.age,
     numero : req.body.numero,
     mdp : hashedPassword,
   });
   
   bob.save(function(err, bob) {
     if (err) res.send(err);

     var rib = new Rib ({
      pays: req.body.pays,
      iban: req.body.iban,
      bic: req.body.bic,
      banque: req.body.banque,
      user : bob._id
     });

    rib.save(function (err){
        if (err) return handleError(err);

        var compte = new Compte({
          user: bob._id 
        });
    
        compte.save(function (err) {
          if (err) return handleError(err);
    
          bob.comptes.push(compte);
          bob.ribs.push(rib);

          bob.save(function(err){});
    
        });
    });
     
     
 
     res.redirect('/login');
 });
 };
 


//Connecte un utilisateur, crée une session avec ses données et le redirige vers la page d'accueil
exports.log_a_user = function(req, res) {
  
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    
    if (!user) return res.render('connexion.ejs', { error: 'Nom d\'utilisateur ou mot de passe invalide'});
    
    var passwordIsValid = bcrypt.compareSync(req.body.mdp, user.mdp);
    if (!passwordIsValid) return res.render('connexion.ejs', { error: 'Nom d\'utilisateur ou mot de passe invalide'});
    
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    
    req.session.user = user;
    res.redirect('/home', );
  });
};



// Récupère un utilisateur grâce à son Id dans l'url et affiche ses données
exports.get_a_user = function(req, res) {
  User.findOne({_id: req.params.userId}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

// Met à jour un utilisateur grâce à son Id dans l'url et affiche ses nouvelles données
exports.update_a_user = function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

// Supprime un utilisateur grâce à son Id dans l'url et affiche un message
exports.delete_a_user = function(req, res) {
  User.remove({_id: req.params.userId}, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};
