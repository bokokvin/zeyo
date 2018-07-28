'use strict';


var mongoose    = require('mongoose'),
    User        = mongoose.model('Users'),
    Compte      = mongoose.model('Compte'),
    Carte       = mongoose.model('Carte'),
    Rib         = mongoose.model('Rib'),

    bcrypt      = require('bcryptjs'),
    jwt         = require('jsonwebtoken'),
    config      = require('../../config');


exports.get_form = function(req, res) {
    res.render('recharge_carte.ejs', { error: ""});  
  };


exports.recharger = function(req, res) {
    Carte
    .findOne({code: req.body.code}, function (err, carte){
        if (err) return res.status(500).send('Error on the server.');

        if (!carte) return res.render('recharge_carte.ejs', { error: 'Code de recharge erroné'});

        if (carte.status == 1) return res.render('recharge_carte.ejs', { error: 'Code de recharge déjà utilisé'});

        User.findOne({_id: req.session.user._id})
            .populate('comptes')
            .exec(function (err, user){
                if (err) return handleError(err);

                var new_solde = user.comptes[0].solde + parseInt(carte.value);

                user.comptes[0].update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                    if (err) return handleError(err);


                    carte.update({ status: 1}, {new:true}, function () {}
                    )
                    
                    res.status(200).send("Votre recharge a été enregistrée");
                    });
            
            });


    });
  };