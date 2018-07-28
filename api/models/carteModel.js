'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carteSchema = new Schema({
    date_emission   : { type: Date, default: Date.now},
    code            : Number,
    value           : Number,
    status          : String
    //carteValue:  { type: Schema.Types.ObjectId, ref: 'CarteValue', required: true}
});

module.exports = mongoose.model('Carte', carteSchema);