const { mtc } = require("../services/message")
const axios = require('axios').default;
const Wallet = require('../model/wallet')
const redis = require('../services/redis')
const adminUserId=1001
module.exports = {
  async retrieve(req, res) {
    const decoded=req.user
    req.body.userId=decoded.id
    console.log(req.body.userId)
    const findWallet = await Wallet.findOne({ userId: req.body.userId, network: req.body.network })

    if (!findWallet) {
      const body = {
        network: req.body.network,
        userid: req.body.userId
      }
      try {
        let hdwallet = await axios.post(process.env.HD_WALLET_MAKER_URL, body)
        hdwallet = hdwallet.data
        const dataForSave = { privateKey: hdwallet.raw_priv, publicKey: hdwallet.ex_pub, address: hdwallet.address, userId: body.userid, network: body.network }
        let wallet = new Wallet(dataForSave)
        await wallet.save()
        if (req.body.userId != adminUserId) {
          redis.setValue(`${req.body.userId}_${req.body.network}_${req.body.token}`, JSON.stringify({ ...dataForSave, token: req.body.token }), 3600)
        }
        res.json(mtc(true, 'retrieve', { address: hdwallet.address, ...req.body }))
      } catch (error) {
        console.log(error)
        res.json(mtc(true, error.message))
      }
    } else {
      if (req.body.userId != adminUserId) {
        redis.setValue(`${req.body.userId}_${req.body.network}_${req.body.token}`, JSON.stringify({ privateKey: findWallet.privateKey, publicKey: findWallet.publicKey, address: findWallet.address, userId: req.body.userId, network: req.body.network, token: req.body.token }), 3600)
      }
      res.json(mtc(true, 'retrieve_exist', { address: findWallet.address, ...req.body }))

    }


  }
}