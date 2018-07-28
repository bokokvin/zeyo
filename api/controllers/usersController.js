'use strict';


var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Compte = mongoose.model('Compte'),
    Rib = mongoose.model('Rib'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');
    

exports.register_form = function(req, res) {
      res.render('inscription.ejs');  
};


exports.login_form = function(req, res) {
  res.render('connexion.ejs', { error: ""});  
};

exports.logout = function(req, res) {
  req.session.reset();
  res.redirect('/login');
};

exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.home = function(req, res) { 

  User
  .findOne({ _id: req.session.user._id})
  .populate('comptes')
  .exec(function (err, User) {
      res.render('home.ejs',{users: User});
  })



      

  
};


exports.create_a_user = function(req, res) {
 var hashedPassword = bcrypt.hashSync(req.body.mdp, 8);
  
  var bob = new User({
    nom : req.body.nom,
    prenom : req.body.prenom,
    email : req.body.email,
    age : req.body.age,
    numero : req.body.numero,
    mdp : hashedPassword,
    //transfert: '5ad721434b327e38282bd793'
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



/*User
.findOne({ _id: '5ad722ab884bba16bc9176f7'})
.populate({path: 'transfert',
            populate: { path: 'comptes' }
})  
.exec(function (err, recepteur) {
  if (err) return handleError(err);
  //res.status(200).send(recepteur.transfert.comptes[0].solde.toString());
  res.status(200).json(recepteur.transfert.comptes[0].devise);
  
});*/



};


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








exports.get_a_user = function(req, res) {
  User.findOne({_id: req.params.userId}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.update_a_user = function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.delete_a_user = function(req, res) {
  User.remove({_id: req.params.userId}, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};
