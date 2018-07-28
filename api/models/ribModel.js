'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ribSchema = new Schema({
    pays: String,
    devise: String,
    iban: String,
    bic: String,
    banque: String,
    titulaire: String,
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true}
});


module.exports = mongoose.model('Rib', ribSchema);