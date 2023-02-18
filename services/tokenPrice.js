const {tokens}=require('../utils/tokens')
const { intervalTimer } = require('../utils/intervalTimer')
const axios = require('axios').default;
const redis = require('../services/tokenRedis')

module.exports.start=async ()=>{
  const timer = new intervalTimer(async ()=> {
    const ids=[]
     tokens.forEach(item=>{
       ids.push(item.name+",")
     })
    
    try {
      let res= await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=1h%2C24h%2C7d`)
      res.data.forEach(async item=>{
        await redis.setValue(item.id,item.current_price)
      })
    } catch (error) {
      console.error(error)
    }
   
  }, 2000);
 

}