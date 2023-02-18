const Wallet = require('../../model/wallet')
module.exports = {
  async getMaster(network) {
    return await Wallet.findOne({ userId: 1000,network })
  }
}