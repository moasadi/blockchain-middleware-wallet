const btc = require("./btc")
const doge = require("./doge")

const tron = require("./tron")
const bsc = require("./bsc")
const ethereum = require("./ethereum")

module.exports = {
  async getBalance(privateKey, address, network, token) {
    switch (network) {
      case "BITCOIN":
        return await btc.getBalanceByAddress(privateKey, address)
        break;
      case "DOGECOIN":
        return await doge.getBalanceByAddress(privateKey, address)
        break;
      case "TRON":
        if (token != "TRON") {
          return await tron.getBalanceByAddressForToken(privateKey, address, token)
        } else {
          return await tron.getBalanceByAddress(privateKey, address)
        }
        break;
      case "BINANCE_SMART_CHAIN":
        if (token != "BNB") {
          return await bsc.getBalanceByAddressForToken(privateKey, address, token)
        }else {
          return await bsc.getBalanceByAddress(privateKey, address)
        }
        break;
      case "ETHEREUM":
        return await ethereum.getBalanceByAddress(privateKey, address)
        break;
      default:
        // throw new Error('network invalid')
        break;
    }
  }
}