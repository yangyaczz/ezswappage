import {BuyPoolExp, BuyPoolLiner, TradePoolExp, TradePoolLiner} from "../../utils/calculate";
import {ethers} from "ethers";
import Input1155 from "./Input1155";

const update1155SellToPairs = (tokenId, pairs) => {
    let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
    let dec = 1e18
    let maxPrice = 0
    let maxPriceIndex = -1

    // get pool buy price
    if (pairs !== '') {
        pairs.forEach((pair, index) => {
            let res
            let params = [pair.spotPrice / dec, pair.delta / dec, pair.fee / dec, protocolFee / dec, pair.tokenIds.length + 1]

            if (pair.bondingCurve === 'Linear' && pair.type === 'buy') {
                res = BuyPoolLiner(...params)
            } else if (pair.bondingCurve === 'Linear' && pair.type === 'trade') {
                res = TradePoolLiner(...params)
            } else if (pair.bondingCurve === 'Exponential' && pair.type === 'buy') {
                res = BuyPoolExp(...params)
            } else if (pair.bondingCurve === 'Exponential' && pair.type === 'trade') {
                res = TradePoolExp(...params)
            }

            if (res) {
                pair.userGetPrice = res.lastUserSellPrice
                pair.ifUserAddGetPrice = res.userSellPrice

                // get maxPrice pool
                if (pair.tokenBalance / dec >= res.poolBuyPrice) {
                    const currentPrice = res.currentUintSellPrice
                    if (currentPrice > maxPrice) {
                        maxPrice = currentPrice
                        maxPriceIndex = index
                    }
                }
            }
        })
    }

    if (maxPriceIndex !== -1) {
        pairs[maxPriceIndex].tokenIds.push(tokenId)
        pairs[maxPriceIndex].userGetPrice = pairs[maxPriceIndex].ifUserAddGetPrice
        pairs[maxPriceIndex].tuple = [
            [
                pairs[maxPriceIndex].id,
                [tokenId],
                [pairs[maxPriceIndex].tokenIds.length]
            ],
            ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString()).mul(ethers.BigNumber.from('100')).div(ethers.BigNumber.from('100'))
        ]
    } else {
        console.log('nft execced amount')
    }
}


const nftSetBanSelect = (newSids,formikData) => {
    let newSidsPlus = new Array(newSids.length + 1).fill(0)
    let pairs2 = JSON.parse(JSON.stringify(formikData.filterPairs))
    newSidsPlus.forEach(id => {
        update1155SellToPairs(id, pairs2)
    })

    let IdsPlusAmount = 0
    if (pairs2.length > 0) {
        pairs2.forEach(pair => {
            if (pair.tuple) {
                IdsPlusAmount += pair.tokenIds.length
            }
        })
    }

    if (newSidsPlus.length > IdsPlusAmount) {
        return true
    } else {
        return false
    }
}


export {update1155SellToPairs,nftSetBanSelect};
