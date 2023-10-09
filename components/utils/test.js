// import { ethers } from "ethers"

const { ethers } = require('ethers')

const pairs = [
    {
        "id": "0x0d9992922b1ab770661ab79c26c80365a0df3628",
        "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
        "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "token": "0x0b20e82dac9dcc7b9d082c2abb32aef2d33a42d6",
        "type": "buy",
        "assetRecipient": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "bondingCurve": "Exponential",
        "delta": "0",
        "fee": "0",
        "spotPrice": "1000000000000000000",
        "nftIds": [
            ""
        ],
        "ethBalance": null,
        "tokenBalance": "5000000000000000000",
        "ethVolume": "0",
        "createTimestamp": "1696075921",
        "updateTimestamp": "1696075921",
        "nftCount": "0",
        "fromPlatform": 1,
        "protocolFee": "1000000000000000",
        "is1155": false,
        "nftId1155": "0",
        "nftCount1155": 0,
        "collectionName": "tsez721First",
        "tokenType": "ERC721"
    },
    {
        "id": "0x52bd3baa7858e12a28f7aa4aa847af95ea04d286",
        "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
        "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "token": "0x0b20e82dac9dcc7b9d082c2abb32aef2d33a42d6",
        "type": "buy",
        "assetRecipient": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "bondingCurve": "Exponential",
        "delta": "0",
        "fee": "0",
        "spotPrice": "1500000000000000000",
        "nftIds": [
            ""
        ],
        "ethBalance": null,
        "tokenBalance": "4000000000000000000",
        "ethVolume": "0",
        "createTimestamp": "1696078311",
        "updateTimestamp": "1696078311",
        "nftCount": "0",
        "fromPlatform": 1,
        "protocolFee": "1000000000000000",
        "is1155": false,
        "nftId1155": "0",
        "nftCount1155": 0,
        "collectionName": "tsez721First",
        "tokenType": "ERC721"
    }
]


const newPairs = pairs.map(pair => {
    // rebuild pair info
    return {
        ...pair,
        tokenBalance: pair.ethBalance === null ? pair.tokenBalance : pair.ethBalance,   // 该pool拥有的代币数量，用来看该池子是否有效
        tokenIds: [],  // 用户要在这个pool卖出的nft列表
        userGetPrice: 0, // 当前用户目前能从这个池子得到的钱
    }
})

function liner(n, delta) {
    return n * (n - 1) * delta / 2
}
// Buy a pond (linear)
function BuyPoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice
    const poolBuyPrice = (startprice * n - liner(n, delta)) * (1 - tfee)
    const poolBuyPriceFee = (startprice * n - liner(n, delta)) * tfee
    const userSellPrice = (startprice * n - liner(n, delta)) * (1 - tfee - pfee)
    const userSellPriceFee = (startprice * n - liner(n, delta)) * (tfee + pfee)

    const last = n - 1
    const lastUserSellPrice = (startprice * last - liner(last, delta)) * (1 - tfee - pfee)

    const currentSellPrice = userSellPrice - lastUserSellPrice
    return {
        delta: delta,
        spotPrice: spotPrice,
        userSellPrice: userSellPrice,    // 用户此时能得到的钱
        poolBuyPrice: poolBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee,
        lastUserSellPrice: lastUserSellPrice,
        currentSellPrice: currentSellPrice
    }
}

function TradePoolLiner(startprice, delta, tfee, pfee, n = 1, action = 'read') {
    const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) - delta
    const newspotPrice = spotPrice + delta


    const poolBuyPrice = (n * spotPrice - liner(n, delta)) * (1 - tfee)
    const userSellPrice = (n * spotPrice - liner(n, delta)) * (1 - pfee - tfee)
    const poolSellPrice = (n * newspotPrice + liner(n, delta)) * (1 + tfee)
    const userBuyPrice = (n * newspotPrice + liner(n, delta)) * (1 + pfee + tfee)
    const poolBuyPriceFee = (n * spotPrice - liner(n, delta)) * tfee
    const userSellPriceFee = (n * spotPrice - liner(n, delta)) * (tfee + pfee)
    const poolSellPriceFee = (n * newspotPrice + liner(n, delta)) * tfee
    const userBuyPriceFee = (n * newspotPrice + liner(n, delta)) * (tfee + pfee)
    return {
        delta: delta,
        spotPrice: spotPrice,
        poolBuyPrice: poolBuyPrice,
        userSellPrice: userSellPrice,
        poolSellPrice: poolSellPrice,
        userBuyPrice: userBuyPrice,
        poolBuyPriceFee: poolBuyPriceFee,
        userSellPriceFee: userSellPriceFee,
        poolSellPriceFee: poolSellPriceFee,
        userBuyPriceFee: userBuyPriceFee
    }
}


const updateSellToPairs = (pairs, tokenId) => {

    let protocolFee = 5000000000000000   // 0.5%  get from smartcontract 
    let dec = 1e18
    let maxPrice = 0
    let maxPriceIndex = -1

    // get pool buy price
    pairs.forEach((pair, index) => {

        let res = BuyPoolLiner(pair.spotPrice / dec, pair.delta / dec, 0, protocolFee / dec, pair.tokenIds.length + 1)

        pair.userGetPrice = res.lastUserSellPrice
        pair.ifUserAddGetPrice = res.userSellPrice


        // get maxPrice pool
        if (pair.tokenBalance / dec >= res.poolBuyPrice) {
            const currentPrice = res.currentSellPrice
            if (currentPrice > maxPrice) {
                maxPrice = currentPrice
                maxPriceIndex = index
            }
        }
    })

    if (maxPriceIndex !== -1) {
        pairs[maxPriceIndex].tokenIds.push(tokenId)
        pairs[maxPriceIndex].userGetPrice = pairs[maxPriceIndex].ifUserAddGetPrice
        pairs[maxPriceIndex].tuple = [
            [
                pairs[maxPriceIndex].id,
                pairs[maxPriceIndex].tokenIds,
                [pairs[maxPriceIndex].tokenIds.length]
            ],
            ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString())
        ]
    } else {
        // console.log('erroreeee')
    }
}

for (let i = 0; i < 2; i++) {
    updateSellToPairs(newPairs, 21)
}

let a = []

newPairs.forEach((pair) => {

    if (pair.tuple) {
        a.push(pair.tuple)
    }
})

console.log(a)

console.log(newPairs)



a = [
    {
        "id": "0x0d9992922b1ab770661ab79c26c80365a0df3628",
        "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
        "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "token": "0x0b20e82dac9dcc7b9d082c2abb32aef2d33a42d6",
        "type": "buy",
        "assetRecipient": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "bondingCurve": "Linear",
        "delta": "0",
        "fee": "0",
        "spotPrice": "1000000000000000000",
        "nftIds": [
            ""
        ],
        "ethBalance": null,
        "tokenBalance": "5000000000000000000",
        "ethVolume": "0",
        "createTimestamp": "1696075921",
        "updateTimestamp": "1696075921",
        "nftCount": "0",
        "fromPlatform": 1,
        "protocolFee": "1000000000000000",
        "is1155": false,
        "nftId1155": "0",
        "nftCount1155": 0,
        "collectionName": "tsez721First",
        "tokenType": "ERC721",
        "tokenIds": [],
        "userGetPrice": ""
    },
    {
        "id": "0x52bd3baa7858e12a28f7aa4aa847af95ea04d286",
        "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
        "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "token": "0x0b20e82dac9dcc7b9d082c2abb32aef2d33a42d6",
        "type": "buy",
        "assetRecipient": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "bondingCurve": "Linear",
        "delta": "0",
        "fee": "0",
        "spotPrice": "1500000000000000000",
        "nftIds": [
            ""
        ],
        "ethBalance": null,
        "tokenBalance": "4000000000000000000",
        "ethVolume": "0",
        "createTimestamp": "1696078311",
        "updateTimestamp": "1696078311",
        "nftCount": "0",
        "fromPlatform": 1,
        "protocolFee": "1000000000000000",
        "is1155": false,
        "nftId1155": "0",
        "nftCount1155": 0,
        "collectionName": "tsez721First",
        "tokenType": "ERC721",
        "tokenIds": [],
        "userGetPrice": ""
    }
]


b = [
    {
        "id": "0x4ea765e6e71a3354c9bd7484dad15a7ebf7ec092",
        "collection": "0xd48aa2a392a1c6253d88728e20d20f0203f8838c",
        "owner": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "token": null,
        "type": "buy",
        "assetRecipient": "0xe3a463d743f762d538031bad3f1e748bb41f96ec",
        "bondingCurve": "Linear",
        "delta": "0",
        "fee": "0",
        "spotPrice": "20000000000000000",
        "nftIds": [
            ""
        ],
        "ethBalance": "100000000000000000",
        "tokenBalance": "100000000000000000",
        "ethVolume": "0",
        "createTimestamp": "1696354559",
        "updateTimestamp": "1696354559",
        "nftCount": "0",
        "fromPlatform": 1,
        "protocolFee": "1000000000000000",
        "is1155": true,
        "nftId1155": "1",
        "nftCount1155": 0,
        "collectionName": "",
        "tokenType": "ERC1155",
        "tokenIds": [],
        "userGetPrice": ""
    }
]