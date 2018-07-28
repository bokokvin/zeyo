'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usersSchema = new Schema({
    nom:  String,
    prenom: String,
    email: String,
    age: Number,
    numero: Number,
    mdp: String,

    comptes : [{ type: Schema.Types.ObjectId, ref: 'Compte'}],
    //transfert:  [{ type: Schema.Types.ObjectId, ref: 'Users'}]
    transfert: [
        {
          dest_nom: {
            type: String
          },
          montant: {
              type: Number
            },

          date: {
              type: Date
          }
          
        }
      ]

});


module.exports = mongoose.model('Users', usersSchema);