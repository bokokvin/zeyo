'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carteSchema = new Schema({
    date_emission   : { type: Date, default: Date.now},
    code            : { type: Number, 
                        default : function() { return Math.floor(Math.random()*900000000300000000000) + 1000000000000000},
                        index: { unique: true }
                    },
    value           : { type: Number, default: 1000},
    status          : { type: Boolean, default: 0},
    //carteValue:  { type: Schema.Types.ObjectId, ref: 'CarteValue', required: true}
});

module.exports = mongoose.model('Carte', carteSchema);