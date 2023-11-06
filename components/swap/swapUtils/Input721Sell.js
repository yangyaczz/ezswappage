import React from 'react'
import { BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp } from '../../utils/calculate'
import { ethers } from 'ethers';

const Input721Sell = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded, setIsBanSelect }) => {

    const update721SellToPairs = (tokenId, pairs) => {

        let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
        let dec = 1e18
        let maxPrice = 0
        let maxPriceIndex = -1

        // get pool buy price
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
            } else {
                res
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

        if (maxPriceIndex !== -1) {

            pairs[maxPriceIndex].tokenIds.push(tokenId)
            pairs[maxPriceIndex].userGetPrice = pairs[maxPriceIndex].ifUserAddGetPrice
            pairs[maxPriceIndex].tuple = [
                [
                    pairs[maxPriceIndex].id,
                    pairs[maxPriceIndex].tokenIds,
                    [pairs[maxPriceIndex].tokenIds.length]
                ],
                ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString()).mul(ethers.BigNumber.from('100')).div(ethers.BigNumber.from('100'))
            ]
        } else {
            // console.log('nft execced amount')
        }
    }


    const toggleSelected = (id) => {

        // add new id to formikdata
        let newSids
        if (formikData.selectIds.includes(id)) {
            newSids = formikData.selectIds.filter(item => item !== id)
        } else {
            newSids = [...formikData.selectIds, id]
        }
        setSelectIds(newSids)


        ///////////////////////////////////////////////////////////////


        let pairs = JSON.parse(JSON.stringify(formikData.filterPairs))

        newSids.forEach((id) => {
            update721SellToPairs(id, pairs)
        })

        let tupleEncode = []
        let totalGet = 0
        let IdsAmount = 0
        pairs.forEach((pair) => {
            if (pair.tuple) {
                tupleEncode.push(pair.tuple)
                totalGet += pair.userGetPrice
                IdsAmount += pair.tokenIds.length
            }
        })

        setTupleEncode(tupleEncode)
        setTotalGet(totalGet)
        ///////////////////////////////////////////////////////////////

        // check if is execeeded
        if (newSids.length > IdsAmount) {
            setIsExceeded(true)
        } else {
            setIsExceeded(false)
        }

        ///////////////////////////////////////////////////////////////
        // check if ban
        let newSidsPlus = new Array(newSids.length + 1).fill(0)
        let pairs2 = JSON.parse(JSON.stringify(formikData.filterPairs))
        newSidsPlus.forEach(id => {
            update721SellToPairs(id, pairs2)
        })

        let IdsPlusAmount = 0
        pairs2.forEach(pair => {
            if (pair.tuple) {
                IdsPlusAmount += pair.tokenIds.length
            }
        })

        if (newSidsPlus.length > IdsPlusAmount) {
            setIsBanSelect(true)
        } else {
            setIsBanSelect(false)
        }
    }



    const initialSquares = formikData.userCollection.tokenIds721


    if (!initialSquares.length) {
        return <div>you don't have this nft</div>
    }

    return (
        <div className='grid grid-cols-5 gap-4'>
            {initialSquares.map((square, index) => (
                <div
                    key={index}
                    className={`
                        flex items-center justify-center w-20 h-20 cursor-pointer
                        ${(formikData.selectIds.includes(square)) ? 'bg-gray-400' : formikData.isBanSelect ? 'bg-black' : 'bg-white'} 
                    `}
                    onClick={() => {
                        if ((formikData.selectIds.includes(square)) || !formikData.isBanSelect) {
                            toggleSelected(square);
                        }
                    }}
                >
                    {square}
                </div>
            ))}
        </div>
    );

}

export default Input721Sell
