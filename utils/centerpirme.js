
const Web3 = require('web3')
let bep20ABI = require('./bep20ABI.json')

class Web3Manager {
    constructor(infuraUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    }

    async getTokenBalance(tokenAddress, address) {
        let abi = bep20ABI;
        let contract = new this.web3.eth.Contract(abi, tokenAddress);
        let decimal = await contract.methods.decimals().call();
        let balance = await contract.methods.balanceOf(address).call();
        return balance / Math.pow(10, decimal);
    }

    async getBalance(address) {
        // Get Balance
        let balance = await this.web3.eth.getBalance(address);
        return balance / Math.pow(10, 18);
    }

    async sendCoin(privateKey, toAddress, amount,gas=21000) {
        try {
            let account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
            let wallet = this.web3.eth.accounts.wallet.add(account);
            amount=roundDown(amount,10)
            const avgGasPrice = await this.web3.eth.getGasPrice();
            const createTransaction = await this.web3.eth.accounts.signTransaction(
                {
                    from: wallet.address,
                    to: toAddress,
                    value: this.web3.utils.toWei(amount.toString(), 'ether'),
                    gas: gas,
                    gasPrice: avgGasPrice
                },
                wallet.privateKey
            );
    
            const createReceipt = await this.web3.eth.sendSignedTransaction(
                createTransaction.rawTransaction
            );
            return createReceipt.transactionHash;
        } catch (error) {
            console.log(error)
            return {error: true}
        }
       
    }

    async sendToken(privateKey, tokenContractAddress, toAddress, amount) {
        let account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        let wallet = this.web3.eth.accounts.wallet.add(account);
        // ABI to transfer ERC20 Token
        let abi = bep20ABI;
        // calculate ERC20 token amount
        let tokenAmount = this.web3.utils.toWei(amount.toString(), 'ether')
        // Get ERC20 Token contract instance
        let contract = new this.web3.eth.Contract(abi, tokenContractAddress, { from: wallet.address });
        const data = await contract.methods.transfer(toAddress, tokenAmount).encodeABI();
        const res = await contract.methods.transfer(toAddress, tokenAmount).send({
            from: wallet.address,
            gas:150000,
        });

        return res.transactionHash;
    }


    isMainNet() {
        return true
        // return ("" +this.infuraUrl).includes("https://bsc-dataseed1.binance.org:443");
    }

 

}
function roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}
module.exports = Web3Manager
