const { intervalTimer } = require('../utils/intervalTimer')
const {getBalance}=require('../services/explorer/index')
const TokenBalance=require('../model/tokenBalance')
const redis=require('./redis')
module.exports = {
  async start() {
    const timer = new intervalTimer(async ()=> {
      console.log(`-------------------- start explorer at ${new Date().toISOString()} --------------------`)
      timer.pause()
      const allWallet= await redis.getAll()
      for(let wallet of allWallet){
        wallet=JSON.parse(wallet)
        let balance= await getBalance(wallet.privateKey,wallet.address,wallet.network,wallet.token)
        console.log(balance)
        if(balance>0){
          await TokenBalance.updateOne({userId:wallet.userId,network:wallet.network,token:wallet.token},{$inc: { balance: balance }},{ upsert: true })
        }
      }

      timer.resume()
      console.log(`-------------------- end explorer at ${new Date().toISOString()} --------------------`)

    }, 3000);

  }
}