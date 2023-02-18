from py_crypto_hd_wallet import HdWalletBip44Coins,HdWalletBipDataTypes, HdWalletBipFactory,HdWalletSaver
from flask import Flask, request, jsonify ,Response
mnemonic = "portion index orient boring cram primary citizen cushion cereal toddler asthma describe degree raccoon process world casual category spray wet energy boost zebra goose"

# HdWalletSaver(hd_wallet).SaveToFile("my_wallet.txt")


api = Flask(__name__)

@api.route('/', methods=['POST'])
def wallet():
  body = request.json
  network=body["network"]
  userid=body["userid"]
  hd_wallet_fact = HdWalletBipFactory(HdWalletBip44Coins[network])
  addr_num=userid
  hd_wallet = hd_wallet_fact.CreateFromMnemonic("my_wallet_name", mnemonic)
  hd_wallet.Generate(acc_idx=addr_num,addr_num=1,addr_off=addr_num)
  addresses = hd_wallet.GetData(HdWalletBipDataTypes.ADDRESS)
  return Response(addresses[0].ToJson(), mimetype='text/json')

if __name__ == '__main__':
    api.run() 