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


const InputAmount = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded }) => {
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();

    // const displayFrame = () => {
    //     if (!formikData.selectIds.length) {
    //         return <div>
    //             your tokenId
    //         </div>
    //     }
    //
    //     if (formikData.collection.type === "ERC721") {
    //         return <div className='flex '>
    //             tokenId: {formikData.selectIds.map((id, index) => (<div className='mr-1' key={index}>
    //                 {id}
    //             </div>))}
    //         </div>
    //     }
    //
    //     // todo 1155
    //     if (formikData.collection.type === "ERC1155") {
    //         return <div>
    //             xxxxxxxx
    //         </div>
    //     }
    // }


    // const displayDialog = () => {
    //
    //     if (!formikData.collection.type || !formikData.token) {
    //         return <div>select nft and token first</div>
    //     }
    //
    //     if (formikData.userCollection.tokenIds721 === '') {
    //         return <div>Loading...</div>
    //     }
    //
    //     if (formikData.pairs && formikData.filterPairs.length === 0) {
    //         return <div>there is no pool you can swap...</div>
    //     }
    //
    //     if (formikData.collection.type == "ERC721") {
    //         return (
    //             <Input721
    //                 formikData={formikData}
    //                 setSelectIds={setSelectIds}
    //                 setTotalGet={setTotalGet}
    //                 setTupleEncode={setTupleEncode}
    //                 setIsExceeded={setIsExceeded}
    //             />
    //         )
    //     }
    //
    //     if (formikData.collection.type == "ERC1155") {
    //         return (
    //             <Input1155
    //                 formikData={formikData}
    //                 setSelectIds={setSelectIds}
    //                 setTotalGet={setTotalGet}
    //                 setTupleEncode={setTupleEncode}
    //                 setIsExceeded={setIsExceeded}
    //             />
    //         )
    //     }
    // }

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
                            return <em>Select Items{selected.length+" "+formikData.isExceeded+" fafa"}</em>;
                        }
                        return  <em className={styles.nftSelectedText}><img className={styles.logoStyle} src="/logo.svg" alt=""/><span>{selected.length}</span></em>
                        // return selected;
                    }}
                    MenuProps={MenuProps}
                >
                    <MenuItem disabled value="">
                        <em>Select Items</em>
                    </MenuItem>
                    {formikData?.userCollection?.tokenIds721 !== '' ?
                        formikData.userCollection.tokenIds721.map((nft, index) => (
                            formikData.isExceeded && personName.length>0 && !personName.includes(nft) ?
                            <MenuItem disabled style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}><img className={styles.logoStyle} src="/logo.svg" alt=""/>{nft}</MenuItem>
                            :<MenuItem style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}><img className={styles.logoStyle} src="/logo.svg" alt=""/>{nft}</MenuItem>
                        )): null}
                </Select>
            </FormControl>
        </div>
        // <div className="form-control">
        //     <span className="label-text">Input Amount</span>
        //
        //
        //     <button className="btn" onClick={() => document.getElementById('input_sell').showModal()}>
        //         {displayFrame()}
        //         <div>
        //             <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
        //         </div>
        //     </button>
        //
        //     <dialog id="input_sell" className="modal">
        //         <div className="modal-box">
        //             <h3 className="font-bold text-lg">TokenId:</h3>
        //
        //             {displayDialog()}
        //
        //             <div>{formikData.isExceeded && 'The amount of nft is out of range, please reduce it'}</div>
        //             <div className="divider"></div>
        //
        //             <h3 className="font-bold text-lg">NFT Amount:</h3>
        //             {/* <input type="range" min={0} max={initialSquares.length} value={selectedCount} className="range"></input> */}
        //
        //             <div className="mt-4">
        //                 You have select: {formikData.selectIds.length}
        //             </div>
        //
        //
        //             <form method="dialog">
        //                 <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        //             </form>
        //         </div>
        //
        //
        //         <form method="dialog" className="modal-backdrop">
        //             <button>close</button>
        //         </form>
        //
        //
        //     </dialog>
        // </div>
    )
}

export default InputAmount
