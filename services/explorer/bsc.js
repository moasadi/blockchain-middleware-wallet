const  Web3Manager= require('../../utils/centerpirme');
var web3Manager = new Web3Manager('https://bsc-dataseed1.binance.org:443');
const Master=require('./master')
const transactionFeeBNB=0.000105
const CONTRACTS = {
  SHIBA:{contract: '0x2859e4544c4bb03966803b044a93563bd2d0dd4d', fee: 0.001,minDepositToken:1000},
  CARDANO:{contract:'0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',fee:0.0015,minDepositToken:1},
  XRP:{contract:'0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',fee:0.0015,minDepositToken:1}
};
module.exports={
  async getBalanceByAddress(privateKey,address){
    let balance=await web3Manager.getBalance(address)
    if(balance>=0.002){
      let resp= await web3Manager.sendCoin(privateKey,process.env.BSC_MASTER_WALLET_ADDRESS,balance-transactionFeeBNB)
      if(resp.error){
        balance=0
      }
    }else{
      balance=0
    }
    return balance
  },
  async getBalanceByAddressForToken(privateKey, address, token){
    let balanceToken= await web3Manager.getTokenBalance(CONTRACTS[token].contract,address)
    let balanceBNB=await web3Manager.getBalance(address)
    if(balanceToken>CONTRACTS[token].minDepositToken){
      if(balanceBNB>=CONTRACTS[token].fee){
        await web3Manager.sendToken(privateKey,CONTRACTS[token].contract,process.env.BSC_MASTER_WALLET_ADDRESS,balanceToken)
      }else{
        const master=await Master.getMaster("BINANCE_SMART_CHAIN")
        await web3Manager.sendCoin(master.privateKey,address,CONTRACTS[token].fee-balanceBNB)
        balanceToken=0
      }
    }else{
      if(balanceBNB>transactionFeeBNB){
        await web3Manager.sendCoin(privateKey,process.env.BSC_MASTER_WALLET_ADDRESS,balanceBNB-transactionFeeBNB)
      }
      balanceToken=0
    }
    return balanceToken

  }
}