import React, { useState } from 'react'
import { erc20ABI } from 'wagmi'
import { useContractRead } from 'wagmi'

const TokenSearch = ({ formikData, owner, reset23, setToken, setTokenName, setFilterPairs, setSwapMode }) => {

    const handleTokenClick = (token) => {
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
            formikData.tokens.map((token, index) => (
                <button
                    key={index}
                    className="btn justify-start"
                    onClick={() => handleTokenClick(token)}>
                    {token}
                </button>
            ))

        )

    }


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
            <span className="label-text">Token</span>


            <button className="btn" onClick={() => document.getElementById('token_search_sell').showModal()}>
                {formikData.token ? (formikData.token === 'ETH' ? 'ETH' : formikData.tokenName) : 'token name'}
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