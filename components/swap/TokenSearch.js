import React, { useState } from 'react'
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {Box, Chip, OutlinedInput} from "@mui/material";
import { erc20ABI } from 'wagmi'
import { useContractRead } from 'wagmi'

const TokenSearch = ({ formikData, owner, reset23, setToken, setTokenName, setFilterPairs, setSwapMode }) => {

    if (formikData?.userCollection?.tokenIds721!=''){
        formikData?.userCollection?.tokenIds721?.map((item) => {
            console.log('item', item)
        })
    }

    const handleTokenClick = (event,token) => {
        setAge(event.target.value);
        reset23()
        setToken(token)

        // filter pool
        let filteredData = formikData.pairs.filter(item => item.owner.toLowerCase() !== owner.toLowerCase());
        if (token === 'ETH') {
            filteredData = filteredData.filter(item => item.token === null);
        } else {
            filteredData = filteredData.filter(item => item.token === token);
        }

        // rebuild pair info
        filteredData = filteredData.map(item => {
            return {
                ...item,
                tokenBalance: item.ethBalance === null ? item.tokenBalance : item.ethBalance,   // this pool token balance, vaild or not
                tokenIds: [],  // user sell tokenId in this pool
                userGetPrice: '', // user can get the price from this pool
            }
        })
        setFilterPairs(filteredData)

        console.log(filteredData)


        if (formikData.collection.type === 'ERC721' && token === 'ETH') {
            setSwapMode('ERC721-ETH')
        } else if (formikData.collection.type === 'ERC721' && token !== 'ETH') {
            setSwapMode('ERC721-ERC20')
        } else if (formikData.collection.type === 'ERC1155' && token === 'ETH') {
            setSwapMode('ERC1155-ETH')
        } else if (formikData.collection.type === 'ERC1155' && token !== 'ETH') {
            setSwapMode('ERC1155-ERC20')
        } else {
            setSwapMode('ERROR-SWAPMODE')
        }
    }
    const [age, setAge] = useState('');

    const { data: erc20Name } = useContractRead({
        address: (formikData.token !== '' ? (formikData.token === "ETH" ? '' : formikData.token) : ''),
        abi: erc20ABI,
        functionName: 'name',
        args: [],
        watch: false,
        onSuccess(data) {
            setTokenName(data)
        }
    })
    return (
        <div className="form-control">
            {/*<span className="label-text">Token</span>*/}
            <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={age}
                    onChange={handleTokenClick}
                    displayEmpty
                    multiple
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    inputProps={{ 'aria-label': 'Without label' }}
                    className={styles.selectItem}
                    sx={{color:'white',background: '#06080F'}}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Select Items</em>;
                        }
                        return <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        // return selected;
                    }}
                >
                    <MenuItem disabled value="">
                        <em>Select Items</em>
                    </MenuItem>
                    {formikData?.userCollection?.tokenIds721 != '' ?
                        formikData.userCollection.tokenIds721.map((nft, index) => (
                            <MenuItem value={nft} className={styles.selectItem}><img className={styles.logoStyle} src="/logo.svg" alt=""/>{nft}</MenuItem>
                        )): null}
                </Select>
            </FormControl>
        </div>
    )
}

export default TokenSearch
