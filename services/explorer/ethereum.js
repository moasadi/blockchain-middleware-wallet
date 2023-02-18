const  Web3Manager= require('../../utils/centerpirme');
var web3Manager = new Web3Manager(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
module.exports={
  async getBalanceByAddress(privateKey,address){
    let balance=await web3Manager.getBalance(address)
    if(balance>0.0009){
      console.log(balance)
      let resp= await web3Manager.sendCoin(privateKey,process.env.ETH_MASTER_WALLET_ADDRESS,balance-0.0009)
      console.log(resp)
      if(resp.error){
        balance=0
      }
    }else{
      balance=0
    }
    return balance
  }
}