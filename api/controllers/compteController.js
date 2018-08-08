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

// Affiche le formulaire de création d'un nouveau compte
exports.create_form = function(req, res) {
    res.render('new_compte_form.ejs', { error: ""});  
  };

// Affiche le fil d'activité des comptes
exports.activite = function(req, res) {

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

        var layout = {
            xaxis: {
                title: "Date",
                rangemode: {enumerated:"nonnegative"},
                titlefont: {
                  family: "Arial, sans-serif", tickangle: 45,
                tickfont: {
                  family: "Old Standard TT, serif",
                  size: 14,
                  color: "black"
                },
                  size: 18,
                  color: "lightgrey"
                },
                showticklabels: true,
               
                exponentformat: "e",
                showexponent: "All"
              },
              yaxis: {
                title: "Montant",
                titlefont: {
                  family: "Arial, sans-serif",
                  size: 18,
                  color: "lightgrey"
                },
                showticklabels: true,
                tickangle: 45,
                tickfont: {
                  family: "Old Standard TT, serif",
                  size: 14,
                  color: "black"
                },
                exponentformat: "e",
                showexponent: "All"
              }
            
          };

        var graphOptions = {layout: layout, filename: "date-axes", fileopt: "overwrite"};
        
        plotly.plot(data, graphOptions, function (err, msg) {
            console.log(msg);
        });  
        
        res.render('activite.ejs', {transaction: transaction, moment: moment})
    });
}

  


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
    
            res.redirect('/home', );
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

        if (req.body.montant < 5 )
            return res.render('transaction_form.ejs', { req: req, error: 'Le montant minimum d\'une transaction est de 10 euros'});
        
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
                //if (err) return handleError(err);

                if (compte_dest == null)
                return res.render('transaction_form.ejs', { req: req, error: 'Numéro de compte erroné'});
                
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

                    req.session.message= 'Votre transaction a été bien effectuée.';    
                    res.redirect(url.format({
                        pathname:"/home",
                        
                      }) );
                });
                
        });

    });


    
}

