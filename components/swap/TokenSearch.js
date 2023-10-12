import React, { useState } from 'react'

import multiSetFilterPairMode from './swapUtils/multiSetFilterPairMode'
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";


const TokenSearch = ({ formikData, owner, reset23, setToken, setTokenName, setFilterPairs, setSwapMode }) => {
    const [age, setAge] = useState('');

    const handleTokenClick = (event,tokenName) => {
        setAge(event.target.value);
        reset23()
        tokenName=tokenName.props.value
        // use tokenName to get token
        let token = (formikData.golbalParams.recommendERC20.find(obj => obj.name.toLowerCase() === tokenName.toLowerCase())).address

        setToken(token)
        setTokenName(tokenName)

        let filteredData = formikData.pairs
        multiSetFilterPairMode(formikData, filteredData, owner, token, setFilterPairs, setSwapMode)
    }


    const displayDialog = () => {

        if (!formikData.collection.address) {
            return <div>select nft first</div>
        }

        if (formikData.collection.address && formikData.pairs === '') {
            return <div>Loading...</div>
        }

        if (formikData.collection.address && !formikData.pairs.length) {
            return <div>this collection dont have pool to swap</div>
        }

        return (
            formikData.tokensName.map((tokenName, index) => (
                <button
                    key={index}
                    className="btn justify-start"
                    onClick={() => handleTokenClick(tokenName)}>
                    {tokenName}
                </button>
            ))
        )
    }


    return (
        <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
            <Select
                value={age}
                onChange={handleTokenClick}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className={styles.selectItem}
                sx={{color:'white',background: '#06080F'}}
                renderValue={(selected) => {
                    if (formikData.tokenName === '') {
                        return <em>Select Token</em>;
                    }
                    return <em className={styles.tokenStyle}><span>{formikData.tokenName}</span><span>{formikData.totalGet ? formikData.totalGet.toFixed(3) : 0}</span></em>;
                }}
            >
                <MenuItem disabled value="">
                    <em>Select Token</em>
                </MenuItem>
                {formikData.tokensName!= ''?formikData.tokensName.map((tokenName, index) => (
                    <MenuItem value={tokenName} className={styles.selectItem}>{tokenName}</MenuItem>
                )):null}
            </Select>
        </FormControl>
        // <div className="form-control">
        //
        //     <button className="btn justify-between" onClick={() => document.getElementById('token_search_sell').showModal()}>
        //         <div className='flex justify-start items-center space-x-2'>
        //             <div>
        //                 {formikData.tokenName ? formikData.tokenName : 'select token'}
        //             </div>
        //             <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
        //         </div>
        //         <div className='justify-end'>{formikData.totalGet ? formikData.totalGet.toFixed(3) : 0}</div>
        //     </button>
        //
        //     <dialog id="token_search_sell" className="modal">
        //         <div className="modal-box">
        //             <h3 className="font-bold text-lg">Can Trade Token:</h3>
        //
        //
        //             <form method="dialog" className='flex flex-col space-y-2'>
        //                 {displayDialog()}
        //             </form>
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
        //     </dialog>
        //
        //
        // </div>
    )
}

export default TokenSearch
