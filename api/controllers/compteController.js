'use strict';


var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Compte = mongoose.model('Compte'),
    Rib = mongoose.model('Rib'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');



exports.transaction_form = function(req, res) {
    res.render('transaction_form.ejs', { error: ""});  
  };


exports.create = function(req, res) {

    User
    .findOne({ _id: req.session.user._id})
    .exec(function(err, user){

        var compte = new Compte({
            nom : req.body.nom,
            devise : req.body.devise,
            user : user._id,
            });
    
        compte.save(function(err, compte) {
            if (err) res.send(err);

            user.comptes.push(compte);
            user.save(function(err){});
    
            res.json("Compte créé");
        });

    })
    
   
};  
  

exports.send = function(req, res){

    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, Sender) {
        if (err) return handleError(err);
        
        if (req.body.montant > Sender.comptes[0].solde)
            res.json("Transaction Refusée. Solde insuffisant");

        else
        {
            var new_solde = Sender.comptes[0].solde - parseInt(req.body.montant);
            Sender.comptes[0].update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                if (err) return handleError(err);

                }); 


        }                


    User
        .findOne({nom: req.body.nom})
        .populate('comptes')
        .exec(function (err, Receiver) {
            if (err) return handleError(err);
            
            var new_solde = Receiver.comptes[0].solde + parseInt(req.body.montant);
            
            Receiver.comptes[0].update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                if (err) return handleError(err);

                var donnees_tr = { dest_nom: req.body.nom, montant: req.body.montant, date: Date.now() };    
            
                Sender.transfert.push(donnees_tr);
                Sender.save();
                
                res.json("Transaction effectuée");
                });

            
            
        });

    });
    
}


exports.sending_form = function(req, res){
    
    User
    .findOne({_id: req.session.user._id})
    .populate('comptes')
    .exec(function(err, user){
        res.json(user.comptes[0])
    });
}