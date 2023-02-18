var mongoose = require('mongoose');
var WalletSchema = new mongoose.Schema({
  network:{type: String, required: true},
  userId:{type:String,required:true},
  address:{type:String,required:true},
  privateKey:{type:String,required:true},
  publicKey:{type:String},
}, {timestamps: true});
module.exports = mongoose.model('Wallet', WalletSchema);