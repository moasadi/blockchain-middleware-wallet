
let request = require('async-request');



module.exports.messageToClient = function (success, message, body) {
    return { success, message, body }
}

module.exports.sendSms = async function (phoneNumber, text) {
    /** implement that with your sms provider */
    
    // const username = 'test';
    // const password = 'test'; 
    // await request();

}