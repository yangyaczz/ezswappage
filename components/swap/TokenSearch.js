import React, {useEffect, useState} from 'react'

import multiSetFilterPairMode from './swapUtils/multiSetFilterPairMode'
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {nftSetBanSelect} from "./swapUtils/Input721Math";


const TokenSearch = ({formikData, owner, reset23, setToken, setTokenName, setFilterPairs, setSwapMode, setIsBanSelect}) => {
    const [age, setAge] = useState('ETH');

    const handleTokenClick = (event, tokenName) => {
        setAge(event.target.value);
        reset23()
        tokenName = tokenName.props.value
        console.log('tokenName', tokenName)
        let token = (formikData.golbalParams.recommendERC20.find(obj => obj.name.toLowerCase() === tokenName.toLowerCase())).address
        console.log('token', token)
        setToken(token)
        setTokenName(tokenName)

        let filteredData = formikData.pairs
        multiSetFilterPairMode(formikData, filteredData, owner, token, setFilterPairs, setSwapMode)
    }

    useEffect(() => {
        //721需要看nft下拉框还能不能勾选,可能达到了池子的上限
        if (formikData.collection.type === 'ERC721') {
            const result = nftSetBanSelect([], formikData)
            setIsBanSelect(result)
        }
    }, [formikData.tokenName]);


    return (
        <FormControl sx={{m: 1, minWidth: 400}} className={styles.selectItem}>
            <Select
                value={age}
                onChange={handleTokenClick}
                displayEmpty
                inputProps={{'aria-label': 'Without label'}}
                className={styles.selectItem}
                sx={{color: 'white', background: '#06080F'}}
                renderValue={(selected) => {
                    if (formikData.tokenName === '') {
                        return <div className={styles.selectDefault}><span className={styles.selectDefaultSpan}>Select Token</span>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
                            </svg>
                        </div>;
                    }
                    return <em className={styles.tokenStyle}><span>{formikData.tokenName}</span><span>{formikData.totalGet ? formikData.totalGet.toFixed(3) : 0}</span></em>;
                }}
            >
                <MenuItem disabled value="">
                    <div>Select Token</div>
                </MenuItem>
                {formikData.tokensName !== '' ? formikData.tokensName.map((tokenName, index) => (
                    <MenuItem key={tokenName} value={tokenName} className={styles.selectItem}>{tokenName}</MenuItem>
                )) : null}
            </Select>
        </FormControl>
    )
}

export default TokenSearch
