'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    montant: Number,
    date: { type: Date, default: Date.now },
    sender: { type: Schema.Types.ObjectId, ref: 'Users', required: true},
    receiver: { type: Schema.Types.ObjectId, ref: 'Users', required: true}

});


module.exports = mongoose.model('Transaction', transactionSchema);