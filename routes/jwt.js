const fs = require('fs')
const path = require('path')
const JWTpublicKey = fs.readFileSync(path.join(__dirname, '../', 'keys/jwt/public.key'));
const JWTprivateKey = fs.readFileSync(path.join(__dirname, '../', '/keys/jwt/private.key'));
const jwt = require('jsonwebtoken');

const messageToClient=require('./messages').messageToClient;
module.exports.JWTprivateKey=JWTprivateKey;
module.exports.verifyToken = function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, JWTpublicKey, (err, authData) => {
            if (err) {
               console.log(err)
                if (err.name === "TokenExpiredError") {
                    res.statusCode=401;
                    res.send(messageToClient(false,err.name,{}));

                    
                } else {
                    res.statusCode=401;
                    //res.json({name:"token_expire"});
                    res.send(messageToClient(false,'token_expire',{}));

                }

            } else {
             
                req.user = authData;
                next();
            }
        });


    } else {
        res.sendStatus(401);
        res.send(messageToClient(false,'token_expire',{}));


    }
}

