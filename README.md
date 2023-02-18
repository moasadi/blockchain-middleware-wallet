## **Blockchain Middleware Wallet**
this project is a middleware blockchain wallet that allows users to create a wallet on different blockchain networks and automatically sends tokens to master wallets, storing them there. it supports erc20, btc, trc20, and bep20 networks.
### Requirements
- Node.js version 12.0 or higher
- MongoDB, Redis, and Mongoose
- Python 3

### Installation
1. Clone the repository: git clone https://github.com/moasadi/blockchain-middleware-wallet.git
1. Install the dependencies: npm install
1. Start the server: npm start

### Usage
#### Creating a Wallet

To create a wallet, make a POST request to /wallet with the following parameters:
- network: The blockchain network you want to create a wallet on (ERC20, BTC,TRC20, or BEP20)
- userId: The ID of the user who will own the wallet (get from jwt token)
- tokenName: The name of the token you want to store in the wallet
- tokenSymbol: The symbol of the token you want to store in the wallet (automatic generate)
- to generate an HD wallet, run the hd_wallet.py Python script in the scripts directory.

**Example request:
**

      POST /wallets/retrieve
        {
          "network": "BINANCE_SMART_CHAIN",
          "token": "CARDANO",
        }
**Example response:
**

    {
      "address": "0x123abc",
      "userId": "user123",
      "tokenName": "My Token",
      "tokenSymbol": "MTK"
    }

#### Authentication and Caching
This project uses JWT tokens for user authentication and authorization. When a user creates a wallet, their token is used to verify their identity and grant access to the wallet. JWT tokens are generated using the jsonwebtoken library.

Wallet addresses are cached using Redis to improve performance. When a user creates a wallet, the wallet address is stored in Redis for faster retrieval. The Redis client is created using the redis library, and wallet addresses are cached for a duration of one hour.
#### Token Price API
This project includes a token price API that allows you to retrieve the current price of supported tokens. To access the API, send a GET request to /tokens. The response will be an array of JSON objects, each representing a supported token and its current price.

Here's an example of what the response may look like:


    [
        {
            "symbol": "ETH",
            "name": "ethereum",
            "networks": [
                "ETHEREUM"
            ],
            "icon": "images/eth.png",
            "price": "1614"
        },
        ...
    ]
    
Each object in the array contains the following fields:

- symbol: The token symbol (e.g. BTC, ETH)
- name: The token name (e.g. bitcoin, ethereum)
- networks: An array of networks on which the token is supported (e.g. BITCOIN,  ETHEREUM)
- icon: The path to an image file that represents the token (e.g. images/btc.png)
- price: The current price of the token in USD (e.g. 24664)
Note that the price field is provided for informational purposes only and is not intended to be used for trading or investment purposes.
#### Postman Collection
A Postman collection is included in the **document** directory. You can use this to test the API endpoints.
