require('dotenv').config()
const { AlphaRouter, ChainId, SwapType } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const JSBI  = require('jsbi') // jsbi@3.2.5


// USER WALLET SETUP
let WALLET_ADDRESS = process.env.WALLET_ADDRESS
let WALLET_SECRET = process.env.WALLET_SECRET

// NETWORK REQUIREMENTS
let NETWORK
let CHAIN_ID
let INFURA_TEST_URL
let web3Provider

// UNISWAP REQUIREMENTS
let V3_SWAP_ROUTER_ADDRESS
let router

let name0 = 'Wrapped Ether'
let symbol0 = 'WETH'
let decimals0 = 18
let address0

let name1 = 'Uniswap Token'
let symbol1 = 'UNI'
let decimals1 = 18
let address1

let WETH
let UNI

let wei
let inputAmount

let bigIntToDecString = ( _value ) => { return bigIntToString(_value, 10); };
let bigIntToString = ( _value, _base ) => { return BigInt(_value).toString(_base); };

setNetwork = async(_network) => {
  NETWORK=_network
    switch(NETWORK) {
      case "GOERLI": {
        CHAIN_ID = ChainId.GÖRLI
        INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
        V3_SWAP_ROUTER_ADDRESS = process.env.GOERLI_UNISWAP_SWAPROUTER_02
        address0 = process.env.GOERLI_WETH
        address1 = process.env.GOERLI_UNI

      }
      break;
      case "SEPOLIA":{
        CHAIN_ID = parseInt(process.env.SEPOLIA_CHAIN_ID)
        INFURA_TEST_URL = process.env.SEPOLIA_INFURA_TEST_URL
        V3_SWAP_ROUTER_ADDRESS = process.env.SEPOLIA_UNISWAP_SWAPROUTER_02
        address0 = process.env.SEPOLIA_WETH
        address1 = process.env.SEPOLIA_UNI
      }
      break;
      case "MAINNET":{
        CHAIN_ID = parseInt(process.env.MAINNET_CHAIN_ID)
        INFURA_TEST_URL = process.env.MAINNET_INFURA_TEST_URL
        V3_SWAP_ROUTER_ADDRESS = process.env.MAINNET_UNISWAP_SWAPROUTER_02
      }
      break;
      default:{
        return false
      }
    }
    web3Provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL)
    console.log("provider = ",web3Provider)
    console.log("chainId = ",CHAIN_ID)
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    try {
       router = new AlphaRouter({ chainId: CHAIN_ID, provider: web3Provider})
    }
    catch(err){
      console.error(err);
      console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS EXITING");
      process.exit(1);
    };
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    WETH = new Token(CHAIN_ID, address0, decimals0, symbol0, name0)
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
    UNI = new Token(CHAIN_ID, address1, decimals1, symbol1, name1)
    wei = ethers.utils.parseUnits('0.01', 18)
    console.log("INPUT WEI AMOUNT:", wei)
    console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
    inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))
    router = new AlphaRouter({ chainId: CHAIN_ID, provider: web3Provider})
    return true;
  }

main = async() => {
  // setNetwork(process.env.GOERLI_NETWORK_NAME)
  setNetwork(process.env.SEPOLIA_NETWORK_NAME)
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
  console.log("INPUT WEI AMOUNT:", wei)
  console.log("INPUT WEI AMOUNT:", bigIntToDecString(wei))

  console.log("==================================================================================================================================")
  await runAlphaRouterSWAP()
}

// const options = {
//   recipient: WALLET_ADDRESS, 
//   slippageTolerance: new Percent(10, 1000), 
//   deadline: Math.floor(Date.now() / 1000 + 1800), 
//   type: SwapType.SWAPROUTER_02,
//   }


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

  console.log("SwapType =",SwapType)
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
