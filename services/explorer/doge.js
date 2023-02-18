const soChain = require('sochain');
const chain = new soChain('DOGE');
const bitcore = require("bitcore-lib-doge");
const axios = require('axios').default;

module.exports = {
  async getBalanceByAddress(privateKey, address) {
    try {
      let balance = 0
      let wallet = await chain.address(address)
      balance = parseFloat(wallet.balance)
      if (wallet.pending_value < 0) {
        balance = balance + parseFloat(wallet.pending_value)
      }

      if (balance > 0) {
        try {
          let res = await sendDoge(privateKey, address, balance)
          if (res == false) {
            balance = 0
          }
        } catch (e) {
          console.log(e)
          balance = 0
        }

      }
      return balance
    } catch (e) {
      console.log(e.message);
    }

  }
}
async function sendDoge(privateKey, sourceAddress, amountToSend) {
  const recieverAddress = process.env.DOGE_MASTER_WALLET_ADDRESS
  const sochain_network = "DOGE";
  let satoshiToSend = amountToSend * 100000000;
  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;
  const utxos = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
  );
  const transaction = new bitcore.Transaction();
  let totalAmountAvailable = 0;

  let inputs = [];
  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  })
  transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
   fee = 1500000
   satoshiToSend-=fee

   console.log(totalAmountAvailable - satoshiToSend - fee)
  if (totalAmountAvailable - satoshiToSend - fee < 0) {
    throw new Error("Balance is too low for this transaction");
  }

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee);

  // Sign transaction with your private key
  transaction.sign(privateKey);

  // serialize Transactions
  const serializedTransaction = transaction.serialize();
  // Send transaction
  const result = await axios({
    method: "POST",
    url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
    data: {
      tx_hex: serializedTransaction,
    },
  });
  console.log(result.data.data)
  return result.data.data;

}