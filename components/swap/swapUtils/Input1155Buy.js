import React, { useState, useEffect } from 'react';
import { SellPoolLiner, TradePoolLiner, SellPoolExp, TradePoolExp, } from "../../utils/calculate";
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from "./index.module.scss";

function Input1155Buy({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded }) {

    const [value, setValue] = useState(0);
    const tId = formikData.collection.tokenId1155
    const [max, setMax] = useState(0);
    const {languageModel } = useLanguage();
    useEffect(() => {
        let totalNftCount1155 = formikData.filterPairs.reduce((sum, item) => sum + item.nftCount1155, 0);
        setMax(totalNftCount1155)
    }, [formikData.filterPairs])

    const update1155BuyToPairs = (tokenId, pairs) => {
        let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
        let dec = 1e18
        let minPrice = 0
        let minPriceIndex = -1

        // get pool sell price
        pairs.forEach((pair, index) => {

            let res
            let params = [pair.spotPrice / dec, pair.delta / dec, pair.fee / dec, protocolFee / dec, pair.tokenIds.length + 1]

            if (pair.bondingCurve === "Linear" && pair.type === "sell") {
                res = SellPoolLiner(...params);
            } else if (pair.bondingCurve === "Linear" && pair.type === "trade") {
                res = TradePoolLiner(...params);
            } else if (pair.bondingCurve === "Exponential" && pair.type === "sell") {
                res = SellPoolExp(...params);
            } else if (pair.bondingCurve === "Exponential" && pair.type === "trade") {
                res = TradePoolExp(...params);
            } else {
                res;
            }

            if (res) {
                pair.userGetPrice = res.lastUserBuyPrice
                pair.ifUserAddGetPrice = res.userBuyPrice

                // get max Price pool   // if token enough       pair.nftCount1155 > pair.tokenIds.length
                if (pair.nftCount1155 > pair.tokenIds.length) {
                    const currentPrice = res.currentUintBuyPrice

                    if (minPrice === 0) {
                        minPrice = currentPrice
                        minPriceIndex = index
                    } else {
                        if (currentPrice < minPrice) {
                            minPrice = currentPrice
                            minPriceIndex = index
                        }
                    }
                }
            }
        })


        if (minPriceIndex !== -1) {

            pairs[minPriceIndex].tokenIds.push(tokenId)
            pairs[minPriceIndex].userGetPrice = Number((pairs[minPriceIndex].ifUserAddGetPrice * 1.005 ).toFixed(10))   // 0.5 % slippling
            pairs[minPriceIndex].tuple = [
                [
                    pairs[minPriceIndex].id,
                    [tokenId],
                    [pairs[minPriceIndex].tokenIds.length]
                ],
                ethers.utils.parseEther(pairs[minPriceIndex].userGetPrice.toString())
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
            update1155BuyToPairs(id, pairs)
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
        console.log('totalGet', totalGet)
        ///////////////////////////////////////////////////////////////

        // check if is execeeded
        if (formikData.userCollection.tokenBalance20 < totalGet) {
            setIsExceeded(true);
        } else {
            setIsExceeded(false);
        }
    }




    const handleChange = (e) => {
        const inputValue = e.target.value;

        // check
        if (/^\d+$/.test(inputValue)) {
            setValue(Math.min(Math.max(0, Number(inputValue)), max));
        } else {
            setValue(0);
        }
    };


    const handleIncrement = () => {
        setValue(prev => Math.min(prev + 1, max))
    };

    const handleDecrement = () => {
        setValue(prev => Math.max(prev - 1, 0))
    };


    useEffect(() => {
        toggleSelected(tId, value)
    }, [value]);



    //////////////////////////////////////////////////////////////////////////////
    // if (formikData.userCollection.tokenAmount1155 === 0) {
    //     return <div>{`you don't have this nft`}</div>
    // }


    return (
        <div className='flex items-center justify-center space-x-4 justify-between'>
            <div><span className='mr-3 font-bold'>{languageModel.YouwanttobuyNftAmount}:</span></div>
            <div className='form-control'>
                <div className="input-group">
                    <button onClick={handleDecrement} className="btn-square rounded-r-none border max-[800px]:w-10  border-white border-white hover:border-white bg-black rounded-l-xl">-</button>
                    <input type="text" value={value} onChange={handleChange} className=" max-[800px]:w-14 w-20 rounded-none text-center border-y py-[11px] border-y-white bg-black"/>
                    <button onClick={handleIncrement} className="btn-square rounded-l-none border max-[800px]:w-10  border-white border-white hover:border-white bg-black rounded-r-xl">+</button>
                </div>
            </div>


        </div>
    )
}

export default Input1155Buy;
