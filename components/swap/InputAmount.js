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
import {update721SellToPairs} from "./swapUtils/Input721Math";
import {nftSetBanSelect} from "./swapUtils/Input721Math";
import {useSelector} from "react-redux";


const InputAmount = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded,setIsBanSelect }) => {
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();

    /////////////////////////////////////////intpu721 copy过来的///////////////////////////////////////////////////////////



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
        if (newSids.length > IdsAmount) {
            setIsExceeded(true)
        } else {
            setIsExceeded(false)
        }
        const result=nftSetBanSelect(newSids,formikData)
        setIsBanSelect(result)
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

    const collectionSearchStatus = useSelector((state) => state.collectionSearchStatus.value);
    return (
        <div className="form-control">
            <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={personName}
                    disabled={collectionSearchStatus}
                    onChange={toggleSelected}
                    displayEmpty
                    multiple
                    // inputProps={{  MenuProps: {
                    //         MenuListProps: {
                    //             sx: {
                    //                 backgroundColor: '#292B45',
                    //                 maxHeight: '224px',
                    //                 color:'#FFFFFF',
                    //             }
                    //         }
                    //     } }}
                    className={styles.selectItem}
                    sx={{color:'white',background: '#06080F'}}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return collectionSearchStatus?<span class="loading loading-spinner loading-sm text-accent"></span>:<div className={styles.selectDefault}><span className={styles.selectDefaultSpan}>Select Items</span><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg></div>;
                        }
                        return  <div className={styles.nftSelectedText}><img className={styles.logoStyle} src={formikData.collection.img} alt=""/><span>{selected.length}</span></div>
                        // return selected;
                    }}
                    MenuProps={MenuProps}
                >
                    <MenuItem disabled value="">
                        <div>{"Select Items("+formikData?.userCollection?.tokenIds721.length+")"}</div>
                    </MenuItem>
                    {formikData?.userCollection?.tokenIds721 !== '' ?
                        formikData.userCollection.tokenIds721.map((nft, index) => (
                            (formikData.isBanSelect || formikData.filterPairs.length===0) && !personName.includes(nft) ?
                            <MenuItem disabled style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}><img className={styles.logoStyle} src={formikData.collection.img} alt=""/>{nft}</MenuItem>
                            :<MenuItem style={getStyles(name, personName, theme)} key={nft} value={nft} className={styles.selectItem}>
                                    <div className={styles.optionStyle}>
                                        <div className={styles.optionImgText}>
                                        <img className={styles.logoStyle} src={formikData.collection.img} alt=""/>{nft}
                                        </div>
                                        <div>
                                            {personName.includes(nft)?<img className={styles.yesStyle} src='/yes.svg' alt=""/>:null}
                                        </div>
                                    </div>
                            </MenuItem>
                        )): null}
                </Select>
            </FormControl>
            <div>
                {collectionSearchStatus ?null: formikData.isBanSelect && <div>this pair has no liquidity</div>}
            </div>
        </div>
    )
}

export default InputAmount
