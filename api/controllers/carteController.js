'use strict';


var mongoose    = require('mongoose'),
    User        = mongoose.model('Users'),
    Compte      = mongoose.model('Compte'),
    Carte       = mongoose.model('Carte'),
    Rib         = mongoose.model('Rib'),

    bcrypt      = require('bcryptjs'),
    jwt         = require('jsonwebtoken'),
    config      = require('../../config');



// Affiche la page de choix du compte à recharger
exports.cartes = function(req, res) {
    
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
        res.render('carte.ejs',{users: User});
    })
    
};


exports.get_form = function(req, res) {
    res.render('carte_form.ejs', { req : req, error: ""});  
  };


exports.recharger = function(req, res) {
    Carte
    .findOne({code: req.body.code}, function (err, carte){
        if (err) return res.status(500).send('Error on the server.');

        if (!carte) return res.render('carte_form.ejs', { req : req, error: 'Code de recharge erroné'});

        if (carte.status == 1) return res.render('carte_form.ejs', { req : req, error: 'Code de recharge déjà utilisé'});

        Compte.findOne({_id: req.body.compte_sender})
            .populate('user')
            .exec(function (err, compte){
                if (err) return handleError(err);

                var new_solde = compte.solde + parseInt(carte.value);

                compte.update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                    if (err) return handleError(err);


                    carte.update({ status: 1}, {new:true}, function () {}
                    )
                    
                    req.session.message= 'Votre compte vient d\'être rechargé ! Cliquez sur ce message pour le consulter.'
                    req.session.url= '/comptes'
                    res.redirect('/home', );
                    });
            
            });


    });
  };