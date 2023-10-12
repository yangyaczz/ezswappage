import React, {useEffect, useState} from 'react'

import Input721 from './swapUtils/Input721';
import Input1155 from './swapUtils/Input1155';
import FormControl from "@mui/material/FormControl";
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {BuyPoolExp, BuyPoolLiner, TradePoolExp, TradePoolLiner} from "../utils/calculate";
import {ethers} from "ethers";
import {Box, Chip, OutlinedInput} from "@mui/material";
import { useTheme } from '@mui/material/styles';


const NFT1155 = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded }) => {
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();


    /////////////////////////////////////////intpu721 copy过来的///////////////////////////////////////////////////////////
    const update721SellToPairs = (tokenId, pairs) => {

        let protocolFee = 5000000000000000   // 0.5%  get from smartcontract
        let dec = 1e18
        let maxPrice = 0
        let maxPriceIndex = -1

        // get pool buy price
        if (pairs != ''){
            pairs?.forEach((pair, index) => {

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
                    pairs[maxPriceIndex].tokenIds,
                    [pairs[maxPriceIndex].tokenIds.length]
                ],
                ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString()).mul(ethers.BigNumber.from('100')).div(ethers.BigNumber.from('100'))
            ]
        } else {
            console.log('nft execced amount')
        }
    }


    const toggleSelected = (event,id) => {
        const {target: { value },} = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        id=id.props.value
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
        if (pairs != ''){
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
        if (newSids.length > IdsAmount) {
            setIsExceeded(true)
        } else {
            setIsExceeded(false)
        }
    }
    /////////////////////////////////////////intpu721 copy过来的///////////////////////////////////////////////////////////
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    useEffect(() => {
        setPersonName([])
    }, [formikData?.userCollection?.tokenIds721,formikData.tokenName]);

    return (
        <div className="form-control">
            <Input1155
                formikData={formikData}
                setSelectIds={setSelectIds}
                setTotalGet={setTotalGet}
                setTupleEncode={setTupleEncode}
                setIsExceeded={setIsExceeded}
            />

        </div>
    )
}

export default NFT1155
