import React, { useState, useEffect } from 'react';
import { SellPoolLiner, TradePoolLiner, SellPoolExp, TradePoolExp, } from "../../utils/calculate";
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';

let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
let dec = 1e18

function Input1155Buy({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded }) {

    const [value, setValue] = useState(0);
    const tId = formikData.collection.tokenId1155
    const [max, setMax] = useState(0);
    const { languageModel } = useLanguage();
    const [pairs, setPairs] = useState([])

    useEffect(() => {
        let totalNftCount1155 = formikData.filterPairs.reduce((sum, item) => sum + item.nftCount1155, 0);
        setMax(totalNftCount1155)

        let initialPairs = JSON.parse(JSON.stringify(formikData.filterPairs))

        // sort filterPairs
        initialPairs.forEach((pair) => {

            let res = calculatePairRes(pair)
            if (res) {
                pair.userGetPrice = res.lastUserBuyPrice
                pair.ifUserAddGetPrice = res.userBuyPrice
                pair.currentPrice = res.currentUintBuyPrice
            }
        })

        initialPairs.sort((a, b) => a.currentPrice - b.currentPrice);
        setPairs(initialPairs)
    }, [formikData.filterPairs])

    useEffect(() => {
        let newSids = new Array(value).fill(tId)
        setSelectIds(newSids)
        let updatedPairs = JSON.parse(JSON.stringify(pairs))
        toggleSelected(value, updatedPairs)
    }, [value]);


    function calculatePairRes(pair) {
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
        return res
    }


    function findNewIndex(updatedPair, pairs) {
        if (updatedPair.nftCount1155 <= updatedPair.tokenIds.length) {
            return pairs.length;
        }

        if (updatedPair.currentPrice <= pairs[1].currentPrice) {
            return 0;
        }

        for (let i = 1; i < pairs.length; i++) {
            if (pairs[i].currentPrice > updatedPair.currentPrice) {
                return i;
            }
        }
        return pairs.length;
    }


    function updatePairPosition(pairToUpdate, pairs) {
        let res = calculatePairRes(pairToUpdate);

        pairToUpdate.userGetPrice = res.lastUserBuyPrice;
        pairToUpdate.ifUserAddGetPrice = res.userBuyPrice;
        pairToUpdate.currentPrice = res.currentUintBuyPrice;

        let newIndex = findNewIndex(pairToUpdate, pairs);

        if (newIndex !== 0) {
            pairs.splice(0, 1); // remove old index
            pairs.splice(newIndex-1, 0, pairToUpdate); // insert new index
        }
    }


    const toggleSelected = (length, pairs) => {

        if (length <= 0) {
            let tupleEncode = []
            let totalGet = 0
            pairs.forEach((pair) => {
                if (pair.tuple) {
                    tupleEncode.push(pair.tuple)
                    totalGet += pair.userGetPrice
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
            return
        }


        // update best pair
        pairs[0].tokenIds.push(tId)
        pairs[0].userGetPrice = Number((pairs[0].ifUserAddGetPrice * 1.005).toFixed(10))   // 0.5 % slippling
        pairs[0].tuple = [
            [
                pairs[0].id,
                [tId],
                [pairs[0].tokenIds.length]
            ],
            ethers.utils.parseEther(pairs[0].userGetPrice.toString())
        ]

        console.log('id', pairs[0].id, '-----', pairs[0].currentPrice)   //currentPrice

        updatePairPosition(pairs[0], pairs);
        toggleSelected(length - 1, pairs);
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

    return (
        <div className='flex items-center justify-center p-5 space-x-4'>
            <div><span className='mr-3'>{languageModel.YouwanttobuyNftAmount}:</span></div>
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

export default Input1155Buy;
