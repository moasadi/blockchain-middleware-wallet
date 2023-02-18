const TronWeb = require('tronweb')
const master=require('./master')
const CONTRACTS = {
  USDT: { contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", fee: 9000000 },
};


module.exports = {

  async getBalanceByAddress(privateKey, address) {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',//testnet https://api.shasta.trongrid.io  //mainnet https://api.trongrid.io
      headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
      privateKey: privateKey
    })
    let balance = await tronWeb.trx.getBalance(address);
    if (balance > 1000000) {
      let res = await sendTron(privateKey, address, process.env.TRON_MASTER_WALLET_ADDRESS, balance);
      if (!res) { balance = 0 }
    } else {
      balance = 0
    }
    return balance / Math.pow(10, 6)

  },
  async getBalanceByAddressForToken(privateKey, address, token) {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',//https://api.trongrid.io //main net
      headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
      privateKey: privateKey
    })
    const { abi } = await tronWeb.trx.getContract(CONTRACTS[token].contract);
    const contract = tronWeb.contract(abi.entrys, CONTRACTS[token].contract);
    const balance = await contract.methods.balanceOf(address).call();
    let decimal = await contract.methods.decimals().call();
    let tronBalance = await tronWeb.trx.getBalance(address);
    if (balance > 0) {
      if (tronBalance >= CONTRACTS[token].fee) {
        try {
          const resp = await contract.methods.transfer(process.env.TRON_MASTER_WALLET_ADDRESS, balance.toString()).send();
          console.log(resp)
          return balance / Math.pow(10, decimal)
        } catch (error) {
          console.log(error)
          return 0
        }
      } else {
        let tronMasterWallet= await master.getMaster("TRON")
        await sendTron(tronMasterWallet.privateKey,tronMasterWallet.address,address,CONTRACTS[token].fee)
      }
    }else{
      return 0
    }

  }
}
async function sendTron(privateKey, fromAddress, toAddress, amount) {
  try {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
      privateKey: privateKey
    })
    const tradeobj = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      amount,
      fromAddress
    );
    const signedtxn = await tronWeb.trx.sign(
      tradeobj,
      privateKey
    );

    const receipt = await tronWeb.trx.sendRawTransaction(
      signedtxn
    );
    if(receipt.result){
      return true
    }else{
      return false
    }
  } catch (e) {
    console.log(e)
    return false
  }


}
