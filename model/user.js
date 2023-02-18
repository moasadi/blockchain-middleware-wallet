var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
let autoIncrement = require('mongoose-auto-increment'); 
autoIncrement.initialize(mongoose);
var UserSchema = new mongoose.Schema({
    username: String,
    password: { type: String, maxlength: 200, minlength: 4 },
    verifyCode: { type: String },
    accountType: String,
    phoneNumber: String,
   
}, { timestamps: true });
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(autoIncrement.plugin,{
        model: 'User',
        startAt: 1002,
    
});
module.exports = mongoose.model('User', UserSchema);
