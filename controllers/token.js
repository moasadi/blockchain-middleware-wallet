const { mtc } = require("../services/message")
const redis = require('../services/tokenRedis')
const {tokens}=require('../utils/tokens')
module.exports = {
  async list(req, res) {
   for(item of tokens) {
    let price= await redis.getValue(item.name)
    item.price=price
   }
   res.json(mtc(true,"tokens",tokens))
  }
}