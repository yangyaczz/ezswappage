import React, {useState, useEffect} from 'react';
import {BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp} from '../../utils/calculate'
import {ethers} from 'ethers';
import styles from "./index.module.scss";
import FormControl from "@mui/material/FormControl";

function Input1155({formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded, setIsBanSelect}) {

    const [value, setValue] = useState(1);
    const tId = formikData.collection.tokenId1155
    const max = formikData.userCollection.tokenAmount1155

    const update1155SellToPairs = (tokenId, pairs) => {
        let protocolFee = 5000000000000000   // 0.5%  get from smartcontract
        let dec = 1e18
        let maxPrice = 0
        let maxPriceIndex = -1

        // get pool buy price
        if (pairs != '') {
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
        if (pairs.length > 0) {
            pairs.forEach((pair) => {
                if (pair.tuple) {
                    tupleEncode.push(pair.tuple)
                    totalGet += pair.userGetPrice
                    IdsAmount += pair.tokenIds.length
                }
            })
        }
        setTupleEncode(tupleEncode)
        setTotalGet(totalGet)
        console.log(totalGet)
        ///////////////////////////////////////////////////////////////
        // check if is execeeded
        // check if ban
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
            setIsBanSelect(true)
        } else {
            setIsBanSelect(false)
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
        if (!formikData.isBanSelect){
            setValue(prev => Math.min(prev + 1, max))
        }
    };

    const handleDecrement = () => {
        setValue(prev => Math.max(prev - 1, 1))
    };


    useEffect(() => {
        toggleSelected(tId, value)
    }, [value]);


    //////////////////////////////////////////////////////////////////////////////
    if (formikData.userCollection.tokenAmount1155 === 0) {
        return <div>you dont have this nft</div>
    }


    return (
        <FormControl sx={{m: 1, minWidth: 400}}>
            <div className={styles.nft1155}>
                <div>Sell Amount :</div>
                <div className='form-control'>
                    <div className="input-group">
                        <button onClick={handleDecrement} className="btn btn-square">-</button>
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            className="input input-bordered w-20 text-center"
                        />
                        <button onClick={handleIncrement} className="btn btn-square">+
                        </button>
                    </div>
                </div>
            </div>
        </FormControl>
    )
}

export default Input1155;
