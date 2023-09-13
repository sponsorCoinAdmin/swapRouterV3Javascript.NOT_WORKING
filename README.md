# V3SwapRouter

DEVELOPMENTS NOTES:
================================================================
v3CoreFactoryAddress:              0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD
multicallAddress:                  0x0139141Cd4Ee88dF3Cdb65881D411bAE271Ef0C2
quoterAddress:                     0xbe0F5544EC67e9B3b2D979aaA43f18Fd87E6257F
v3MigratorAddress:                 0x44f5f1f5E452ea8d29C890E8F6e893fC0f1f0f97
nonfungiblePositionManagerAddress: 0x655C406EBFa14EE2006250925e54ec43AD184f8B
tickLensAddress:                   0xEB9fFC8bf81b4fFd11fb6A63a6B0f098c6e21950
swapRouter02Address:               0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE

Sepolia
================================================================
V3 information:
WETH9:                      0xfff9976782d46cc05630d1f6ebab18b2324d6b14
UniswapV3Factory:           0x0227628f3F023bb0B980b67D528571c95c6DaC1c
NonfungiblePositionManager: 0x1238536071E1c677A632429e3655c799b22cDA52
SwapRouter02:               0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E
V2 Supported:               0xb7f907f7a9ebc822a80bd25e224be42ce0a698a0
Permit2:                    0x000000000022D473030F116dDEE9F6B43aC78BA3
UniversalRouter:            0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD


Optimism Goerli
================================================================
OPTIMISM_GOERLI_V3_CORE_FACTORY_ADDRESSES              = 0xB656dA17129e7EB733A557f4EBc57B76CFbB5d10
OPTIMISM_GOERLI_V3_MIGRATOR_ADDRESSES                  = 0xf6c55fBe84B1C8c3283533c53F51bC32F5C7Aba8
OPTIMISM_GOERLI_MULTICALL_ADDRESS                      = 0x07F2D8a2a02251B62af965f22fC4744A5f96BCCd
OPTIMISM_GOERLI_QUOTER_ADDRESSES                       = 0x9569CbA925c8ca2248772A9A4976A516743A246F
OPTIMISM_GOERLI_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES = 0x39Ca85Af2F383190cBf7d7c41ED9202D27426EF6
OPTIMISM_GOERLI_TICK_LENS_ADDRESSES                    = 0xe6140Bd164b63E8BfCfc40D5dF952f83e171758e
"UniversalRouter":                                       0x4648a43B2C14Da09FdF82B161150d3F634f40491
"UniversalRouterV1_2":                                   0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD

Base Goerli
================================================================
v3CoreFactoryAddress:                            0x9323c1d6D800ed51Bd7C6B216cfBec678B7d0BC2
multicall2Address:                               0xB206027a9E0E13F05eBEFa5D2402Bab3eA716439
proxyAdminAddress:                               0xEd033f5c2296ad41370C4DB2395eD672844CE321
tickLensAddress:                                 0x1acB873Ee909D0c98adB18e4474943249F931b92
nftDescriptorLibraryAddressV1_3_0:               0xa9C86b1C210C77cfbd00277f530870a969C7E780
nonfungibleTokenPositionDescriptorAddressV1_3_0: 0x70F236302AadcE4eC69C6786A36b2C1a3563830A
descriptorProxyAddress:                          0x43001cc8e02FF18832E16b10d243c057caDCf79c
nonfungibleTokenPositionManagerAddress:          0x3c61369ef0D1D2AFa70d8feC2F31C5D6Ce134F30
v3MigratorAddress:                               0x3efe5d02a04b7351D671Db7008ec6eBA9AD9e3aE
v3StakerAddress:                                 0x3400699f4d03cB129771ea8385D222E677A017F2
quoterV2Address:                                 0xedf539058e28E5937dAef3f69cEd0b25fbE66Ae9
swapRouter02:                                    0x8357227D4eDc78991Db6FDB9bD6ADE250536dE1d

BASE GOERLI WETH address                       = 0x4200000000000000000000000000000000000006 (edited)
[9:53 PM]
-
[9:53 PM]
-
[9:56 PM]
Get Pool address

For v3 you call the v3 factory contract getPool(tokenA, tokenB, fee)
https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984#readContract#F2

script to get pool address from create2

const { pack, keccak256 } =require('@ethersproject/solidity')
const { getCreate2Address } =require('@ethersproject/address')
const { ethers } =require("ethers")


let tokenA = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // change me!
let tokenB = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // change me!
let token0 = tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenA : tokenB;
let token1 = tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenB : tokenA;

//get v3 pair address via create2
let fee = '3000';
let v3Factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
let Init_Hash = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";

var v3Pair = getCreate2Address(
  v3Factory,
  keccak256(["bytes"],[ethers.utils.defaultAbiCoder.encode(["address","address","uint24"],[token0.toLowerCase(), token1.toLowerCase(), fee])]),
  Init_Hash
)
console.log(v3Pair)
Ethereum (ETH) Blockchain Explorer
Uniswap V3: Factory | Address 0x1f98431c8ad98523631ae4a59f267346ea3...
The Contract Address 0x1f98431c8ad98523631ae4a59f267346ea31f984 page allows users to view the source code, transactions, balances, and analytics for the contract address. Users can also interact and make transactions to the contract directly on Etherscan.