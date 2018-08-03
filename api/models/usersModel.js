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
    ribs : [{ type: Schema.Types.ObjectId, ref: 'Rib'}],

    transactions:  [{ type: Schema.Types.ObjectId, ref: 'Transaction'}], 

});


module.exports = mongoose.model('Users', usersSchema);