var mongoose = require('mongoose');
var tockenBalanceSchema = new mongoose.Schema({
  token:{type:String,required:true},
  balance:{type:Number,default:0},
  userId:{type:String,required:true},
  network:{type:String,required:true}
}, {timestamps: true});
module.exports = mongoose.model('TokenBalance', tockenBalanceSchema);