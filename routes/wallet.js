const express=require('express')
const router=express.Router()
const validator=require('../validators/wallet')
const inputValidator=require('../middlewares/inputValidator')
const controller=require('../controllers/wallet')
const {verifyToken}=require('../utils/jwt')
router
      .post('/retrieve',verifyToken,inputValidator(validator.retrieve),controller.retrieve)
module.exports =router