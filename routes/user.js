
const express=require('express')
const router=express.Router()
const controller=require('../controllers/user')
const inputValidator=require('../middlewares/inputValidator')

const validator=require('../validators/user')
router.get('/auth/smsverification',inputValidator(validator.smsVerification), controller.smsVerification)
router.post('/auth/login', inputValidator(validator.login),controller.login)

module.exports=router