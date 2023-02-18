const soChain = require('sochain');
const chain = new soChain('BTC');
const CryptoAccount = require("send-crypto");

module.exports = {
  async getBalanceByAddress(privateKey, address) {
    try {
      let balance = 0
      let wallet = await chain.address(address)
      balance = parseFloat(wallet.balance)
      if (wallet.pending_value < 0) {
        balance = balance + parseFloat(wallet.pending_value)
      }
      if(balance>0){
       let res=await sendBtc(privateKey, balance)
       if(res==false) {
         balance =0
       }
      }
      return balance
    } catch (e) {
      console.log(e.message);
    }

  }
}
async function sendBtc(privateKey, balance) {
  try {
    const account = new CryptoAccount(privateKey);
    await account.send(process.env.BTC_MASTER_WALLET_ADDRESS, balance, "BTC", {
      subtractFee: true,
    });
    return true
  } catch (error) {
    console.log(error)
    return false
  }

}