const express=require('express')
const router=express.Router()
router.use('/wallets',require('./wallet'))
router.use('/users',require('./user'))
router.use('/tokens',require('./token'))
module.exports =router