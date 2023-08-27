const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const JSBI  = require('jsbi') // jsbi@3.2.5

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

require('dotenv').config()
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET
const INFURA_TEST_URL = process.env.INFURA_TEST_URL

const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL) // Ropsten

const chainId = 5
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider})

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
// const address0 = '0xc778417e063141139fce010982780140aa0cd5ab'
const address0 = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
// const address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
const spCoinAddress = '0xBabA55c7dcE20782fBe8B275216F16d262a70754'
const address1 = spCoinAddress

console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

const WETH = new Token(chainId, address0, decimals0, symbol0, name0)
const UNI = new Token(chainId, address1, decimals1, symbol1, name1)
let msg
msg = "UNI = new Token( " + 
"\nchainId + " + chainId +
"\naddress1 " + address1 +
"\ndecimals1 " + decimals1 +
"\nsymbol1 " + symbol1 +
"\nname1 " + name1 + " )"
console.log (msg)

const wei = ethers.utils.parseUnits('0.01', 18)
const inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))
console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")

async function main() {
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")

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
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

  console.log(`Quote Exact In: ${route.quote.toFixed(10)}`)

  console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
  const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: WALLET_ADDRESS,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000)
  }
  console.log("Here 1")

  const wallet = new ethers.Wallet(WALLET_SECRET)
  console.log("Here 2")
  const connectedWallet = wallet.connect(web3Provider)
  console.log("Here 3")

  const approvalAmount = ethers.utils.parseUnits('1', 18).toString()
  console.log("Here 4")
  const ERC20ABI = require('./abi.json')
  const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider)
  console.log("Here 5")
  await contract0.connect(connectedWallet).approve(
    V3_SWAP_ROUTER_ADDRESS,
    approvalAmount
  ).catch ((err) => {console.log("Connection Error"+err)})

  console.log("Connected")

  const tradeTransaction = await connectedWallet.sendTransaction(transaction)
}

main()
