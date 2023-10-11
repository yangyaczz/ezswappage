import React, { useState } from 'react'
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {Box, Chip, OutlinedInput} from "@mui/material";
import { erc20ABI } from 'wagmi'
import { useContractRead } from 'wagmi'
import multiSetFilterPairMode from './swapUtils/multiSetFilterPairMode'

const TokenSearch = ({ formikData, owner, reset23, setToken, setTokenName, setFilterPairs, setSwapMode }) => {

    const handleTokenClick = (tokenName) => {
        reset23()

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
        <div className="form-control">
            <span className="label-text">Token</span>


            <button className="btn" onClick={() => document.getElementById('token_search_sell').showModal()}>
                {formikData.tokenName ? formikData.tokenName : 'token name'}
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
            </button>

            <dialog id="token_search_sell" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Can Trade Token:</h3>


                    <form method="dialog" className='flex flex-col space-y-2'>
                        {displayDialog()}
                    </form>


                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                </div>


                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>


            </dialog>
        </div>
    )
}

export default TokenSearch
