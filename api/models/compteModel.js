'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var compteSchema = new Schema({
    nom: { type: String, default : "Compte courant"},
    solde: { type: Number, default : 0},
    devise: { type: String, default: "Euro"},
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true}
});


module.exports = mongoose.model('Compte', compteSchema);