'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carteValueSchema = new Schema({
    valeur: Number,
    devise: String
});


module.exports = mongoose.model('CarteValue', carteValueSchema);