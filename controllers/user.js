const User = require('../model/user');
const hash = require('password-hash');
const { messageToClient, sendSms } = require('../utils/messages');
const convertDigit = require('../utils/convertDigit')
const vToken = require('../utils/jwt')
const jwt = require('jsonwebtoken');
const generate=require('../utils/generate')
module.exports = {
 async smsVerification(req, res) {
    let phoneNumber = req.query.phone;
    phoneNumber = convertDigit.a2p(phoneNumber);
    phoneNumber = convertDigit.p2e(phoneNumber);
    if (!phoneNumber) {
      return res.send(messageToClient(false, 'phoneNumber_not_exist', {}));
    }
    let index0 = phoneNumber.indexOf(0);
    if (index0 == 0) {
      phoneNumber = phoneNumber.substring(1);
    }
    if (phoneNumber && phoneNumber.length >= 10) {
    } else {
      return res.send(messageToClient(false, 'phoneNumber_invalid', {}));

    }
    let userExist = false;
    var password = generate.getRandomIntInclusive(1000, 9999);
    let findResult = await User.findOne({ phoneNumber });
    var hashPassword = await hash.generate(password + "");
    if (findResult) {
      var now = Date.now();
      try {
        sendSms(phoneNumber, password);
        console.log(password)
        await User.findOneAndUpdate({ phoneNumber }, { verifyCode: hashPassword, LastSendSmsVerificationTime: now }, { new: false }).exec();

        res.send(messageToClient(true, 'username', { username: findResult.username }));
      } catch (error) {
        res.send(messageToClient(false, 'username', {}));
      }

    } else {
      var username;
      do {
        username = "users" + generate.getRandomIntInclusive(99999999, 9999999999);
        let findResult = await User.findOne({ username })
        if (findResult) {
          userExist = true;
        } else {
          userExist = false;
        }
      } while (userExist);
      sendSms(phoneNumber, password);
      let dataModel = new User({
        username,
        verifyCode: hashPassword,
        phoneNumber,
        sex: -1,
        role: "user",
      });

      await dataModel.save();
      res.send(messageToClient(true, '', { username }));
    }
  },
 async login(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    password = convertDigit.a2p(password);
    password = convertDigit.p2e(password);
    password = password.trim();
    console.log(password)
    let loginMode = req.query.loginmode;
    if (!loginMode) {
      loginMode = 0;
    }
    if (loginMode == 1) {
      if (username) {
        let index0 = username.indexOf(0);
        if (index0 == 0) {
          username = username.substring(1);
        }
      }
    }

    let findResult;
    let dbPassword;
    if (username && password) {

      if (loginMode == 0) {
        findResult = await User.findOne({ username });
        dbPassword = findResult.verifyCode;
      } else {
        findResult = await User.findOne({ phoneNumber: username });
        dbPassword = findResult.password;

      }
      if (findResult) {
        if (await hash.verify(password, dbPassword)) {

          try {
            const token = jwt.sign({ username: findResult.username, role: 'user', id: findResult._id, type: 'token' }, vToken.JWTprivateKey, { expiresIn: '30d', algorithm: 'RS256' });
            const refreshToken = jwt.sign({ username: findResult.username, id: findResult._id, role: 'user', type: 'refresh' }, vToken.JWTprivateKey, { expiresIn: '60d', algorithm: 'RS256' });
            const packet = {
              "token": "bearer " + token,
              "refreshToken": "bearer " + refreshToken,
            }
            res.send(messageToClient(true, 'token_refreshToken', packet));
          } catch (e) {
            console.log(e)
            res.send(messageToClient(false, e.message, {}));
          }
        } else {
          res.send(messageToClient(false, 'login_failed', {}));

        }
      } else {
        res.send(messageToClient(false, 'user_not_find', {}));
      }

    } else {
      res.send(messageToClient(false, 'username_or_password_not_exist', {}));
    }

  }
}