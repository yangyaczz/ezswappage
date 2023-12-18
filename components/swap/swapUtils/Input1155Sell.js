import React, { useState, useEffect } from 'react';
import { BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp } from '../../utils/calculate'
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';

function Input1155Sell({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded }) {

    const [value, setValue] = useState(1);
    const tId = formikData.collection.tokenId1155
    const max = formikData.userCollection.tokenAmount1155
    const {languageModel} = useLanguage()
    const update1155SellToPairs = (tokenId, pairs) => {
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
                    [tokenId],
                    [pairs[maxPriceIndex].tokenIds.length]
                ],
                ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString()).mul(ethers.BigNumber.from('995')).div(ethers.BigNumber.from('1000'))
            ]
        } else {
            console.log('nft execced amount')
        }
    }



    const toggleSelected = (id, length) => {

        let newSids = new Array(length).fill(id)
        setSelectIds(newSids)


        ///////////////////////////////////////////////////////////////

        let pairs = JSON.parse(JSON.stringify(formikData.filterPairs))

        newSids.forEach((id) => {
            update1155SellToPairs(id, pairs)
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

        totalGet = Number(totalGet.toFixed(10));

        setTupleEncode(tupleEncode)
        setTotalGet(totalGet)
        console.log(totalGet)
        ///////////////////////////////////////////////////////////////

        // check if is execeeded
        if (newSids.length > IdsAmount) {
            setIsExceeded(true)
        } else {
            setIsExceeded(false)
        }
    }




    const handleChange = (e) => {
        const inputValue = e.target.value;

        // check
        if (/^\d+$/.test(inputValue)) {
            setValue(Math.min(Math.max(1, Number(inputValue)), max));
        } else {
            setValue(1);
        }
    };


    const handleIncrement = () => {
        setValue(prev => Math.min(prev + 1, max))
    };

    const handleDecrement = () => {
        setValue(prev => Math.max(prev - 1, 1))
    };


    useEffect(() => {
        toggleSelected(tId, value)
    }, [value]);



    //////////////////////////////////////////////////////////////////////////////
    if (formikData.userCollection.tokenAmount1155 === 0) {
        return <div>{languageModel.YouDontHaveThisNFT}</div>
    }


    return (
        <div className='flex items-center p-5 space-x-4'>
            <div>you want to sell nft amount :</div>
            <div className='form-control'>
                <div className="input-group">
                    <button
                        onClick={handleDecrement}
                        className="btn btn-square"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        className="w-20 text-center input input-bordered"
                    />
                    <button
                        onClick={handleIncrement}
                        className="btn btn-square"
                    >
                        +
                    </button>
                </div>
            </div>


        </div>
    )
}

export default Input1155Sell;
