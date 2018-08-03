'use strict';


var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Compte = mongoose.model('Compte'),
    Rib = mongoose.model('Rib'),
    Transaction = mongoose.model('Transaction'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');


// Affiche la liste des comptes
  exports.liste = function(req, res) {
    
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
        res.render('compte.ejs',{users: User});
    })

  };



// Affiche la page de choix du compte à utiliser pour la transaction
exports.transaction = function(req, res) {
    
    User
    .findOne({ _id: req.session.user._id})
    .populate('comptes')
    .exec(function (err, User) {
        res.render('transaction.ejs',{users: User});
    })
    
};


// Crée un nouveau compte et l'associe à l'utilisateur courant 
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



// Affiche le formulaire de transaction en récupérant l'Id du compte choisi par l'envoyeur en champ caché depuis l'url
exports.transaction_form = function(req, res) {
    res.render('transaction_form.ejs', { req : req, error: ""});  
  };
  

// Effectue une transaction depuis le compte dont l'Id est récupéré dans le champ caché vers l'utilisateur
// dont le nom est renseigné dans le champ Nom. Enregistre les données de transfert sur les 2 utilisateurs
exports.send = function(req, res){

    Compte
    .findOne({_id: req.body.compte_sender })
    .populate('user')
    .exec(function (err, sender_compte) {
        //if (err) return handleError(err);
        
        if (req.body.montant > sender_compte.solde)
            return res.render('transaction_form.ejs', { req: req, error: 'Solde insuffisant'});

        else
        {
            var new_solde = sender_compte.solde - parseInt(req.body.montant);
            sender_compte.update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                if (err) return handleError(err);

                }); 


        }                


        Compte
            .findOne({_id: req.body.compte_dest})
            .populate('user')
            .exec(function (err, compte_dest) {
                if (err) return handleError(err);
                
                var new_solde = compte_dest.solde + parseInt(req.body.montant);
                
                compte_dest.update({ solde: new_solde}, {new: true}, function (err, updatedCompte) {
                    if (err) return handleError(err);

                    var transaction = new Transaction({
                        sender: sender_compte.user._id,
                        receiver: compte_dest.user._id,
                        montant : req.body.montant
                    });

                    transaction.save(function (err) {
                        if (err) return handleError(err);
                  
                        compte_dest.user.transactions.push(transaction);
                        sender_compte.user.transactions.push(transaction);

                        compte_dest.user.save();
                        sender_compte.user.save(); 
                  
                      });
                                
                    res.redirect('/transaction', );
                });
                
        });

    });
    
}

