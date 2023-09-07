require('dotenv').config()
const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const JSBI  = require('jsbi') // jsbi@3.2.5

let NETWORK

let V3_SWAP_ROUTER_ADDRESS = process.env.UNISWAP_SWAPROUTER_02

let WALLET_ADDRESS = process.env.WALLET_ADDRESS
let WALLET_SECRET = process.env.WALLET_SECRET
let INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL

let web3Provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL) // Ropsten

// let CHAIN_ID = 5
let CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)

let router = new AlphaRouter({ chainId: CHAIN_ID, provider: web3Provider})

let name0 = 'Wrapped Ether'
let symbol0 = 'WETH'
let decimals0 = 18
let address0 = process.env.GOERLI_WETH
// const address0 = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

let name1 = 'Uniswap Token'
let symbol1 = 'UNI'
let decimals1 = 18
// const address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
// const address1 = process.env.GOERLI_SPCOIN
let address1 = process.env.GOERLI_UNI

let WETH = new Token(CHAIN_ID, address0, decimals0, symbol0, name0)
let UNI = new Token(CHAIN_ID, address1, decimals1, symbol1, name1)

let wei = ethers.utils.parseUnits('0.01', 18)
let inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))

let bigIntToDecString = ( _value ) => { return bigIntToString(_value, 10); };
let bigIntToString = ( _value, _base ) => { return BigInt(_value).toString(_base); };

////////////////////////////////////////

async function setNetwork(_network) {
  NETWORK=_network
    switch(NETWORK) {
      case "GOERLI": {
        CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
      }
      break;
      case "SEPOLIA":{
        CHAIN_ID = parseInt(process.env.SEPOLIA_CHAIN_ID)
      }
      break;
      case "MAINNET":{
        CHAIN_ID = parseInt(process.env.MAINNET_CHAIN_ID)
      }
      break;
      default:{
        return false
      }
    }
    router = new AlphaRouter({ chainId: CHAIN_ID, provider: web3Provider})
    WETH = new Token(CHAIN_ID, address0, decimals0, symbol0, name0)
    UNI = new Token(CHAIN_ID, address1, decimals1, symbol1, name1)
    let wei = ethers.utils.parseUnits('0.01', 18)
    let inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))
    return true;
  }
/////////////////////////////////////////
async function main() {
  NETWORK=process.env.NETWORK
  console.log("==================================================================================================================================")
  console.log("Alpha Router Swap Parameters set as follows")
  console.log("==================================================================================================================================")
  console.log("NETWORK:" , NETWORK)
  console.log("V3_SWAP_ROUTER_ADDRESS:" , V3_SWAP_ROUTER_ADDRESS)
  console.log("WALLET_ADDRESS: {My test Wallet}")
  console.log("WALLET_SECRET: {My private test wallet Key}")
  console.log("INFURA_TEST_URL: {My personal INFURA_TEST_URL}")
  console.log("NETWORK CHAIN_ID:" , NETWORK, "=", CHAIN_ID)
  console.log("TOKEN 0 NAME:", name0, ", SYMBOL:", symbol0 + ", DECIMALS:", decimals0 + ", ADDRESS:", address0 )
  console.log("TOKEN 1 NAME:", name1, ", SYMBOL:", symbol1 + ", DECIMALS:", decimals1 + ", ADDRESS:", address1 )
  console.log("INPUT WEI AMOUNT:", bigIntToString(wei))

  console.log("==================================================================================================================================")
  await runAlphaRouterSWAP()
}

runAlphaRouterSWAP = async() => {
  const route = await router.route(
    inputAmount,
    UNI,
    TradeType.EXACT_INPUT,
    {
      recipient: WALLET_ADDRESS,
      slippageTolerance: new Percent(25, 100),
      deadline: Math.floor(Date.now()/1000 + 1800)
    }
  )

  console.log(`Quote Exact In: ${route.quote.toFixed(10)}`)

  const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: WALLET_ADDRESS,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(100000000)
  }

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(web3Provider)

  const approvalAmount = ethers.utils.parseUnits('1', 18).toString()
  const ERC20ABI = require('./abi.json')
  const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider)
  await contract0.connect(connectedWallet).approve(
    V3_SWAP_ROUTER_ADDRESS,
    approvalAmount
  )

  const tradeTransaction = await connectedWallet.sendTransaction(transaction)
  tradeTransaction.wait()
}

main()
