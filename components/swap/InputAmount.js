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


const InputAmount = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded,setIsBanSelect }) => {
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();

    /////////////////////////////////////////intpu721 copy过来的///////////////////////////////////////////////////////////
    const update721SellToPairs = (tokenId, pairs) => {
        console.log('tokenId pairs',tokenId,pairs)
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
        console.log('formikDataformikData',formikData)
        ///////////////////////////////////////////////////////////////
        let pairs = JSON.parse(JSON.stringify(formikData.filterPairs))

        newSids.forEach((id) => {
            update721SellToPairs(id, pairs)
        })

        let tupleEncode = []
        let totalGet = 0
        let IdsAmount = 0
        if (pairs !== ''){
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
            <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={personName}
                    onChange={toggleSelected}
                    displayEmpty
                    multiple
                    inputProps={{ 'aria-label': 'Without label' }}
                    className={styles.selectItem}
                    sx={{color:'white',background: '#06080F'}}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <div className={styles.selectDefault}><span className={styles.selectDefaultSpan}>Select Items</span><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg></div>;
                        }
                        return  <div className={styles.nftSelectedText}><img className={styles.logoStyle} src={formikData.collection.img} alt=""/><span>{selected.length}</span></div>
                        // return selected;
                    }}
                    MenuProps={MenuProps}
                >
                    <MenuItem disabled value="">
                        <div>Select Items</div>
                    </MenuItem>
                    {formikData?.userCollection?.tokenIds721 !== '' ?
                        formikData.userCollection.tokenIds721.map((nft, index) => (
                            formikData.isBanSelect && personName.length>0 && !personName.includes(nft) ?
                            <MenuItem disabled style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}><img className={styles.logoStyle} src={formikData.collection.img} alt=""/>{nft}</MenuItem>
                            :<MenuItem style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}><img className={styles.logoStyle} src={formikData.collection.img} alt=""/>{nft}</MenuItem>
                        )): null}
                </Select>
            </FormControl>
        </div>
    )
}

export default InputAmount
