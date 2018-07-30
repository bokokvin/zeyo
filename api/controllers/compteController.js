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

  exports.liste = function(req, res) {
    
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
        res.render('compte.ejs',{users: User});
    })

  };


  exports.transaction = function(req, res) {
    
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
        res.render('transaction.ejs',{users: User});
    })
    
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

    Compte
    .findOne({_id: '5adad176db15f8b844a3e471' })
    .exec(function (err, sender_compte) {
        if (err) return handleError(err);
        
        if (req.body.montant > sender_compte.solde)
            res.json("Transaction Refusée. Solde insuffisant");

        else
        {
            var new_solde = sender_compte.solde - parseInt(req.body.montant);
            sender_compte.update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
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
            

                User
                    .findOne({_id: req.session.user._id})
                    .populate('comptes')
                    .exec(function (err, Sender) {
                        if (err) return handleError(err);

                        Sender.transfert.push(donnees_tr);
                        Sender.save();
                    })
               
                
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