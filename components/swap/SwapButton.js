import React, { useState } from 'react'
import { ethers } from 'ethers'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useNetwork, useContractRead, useContractReads, useContractWrite, useAccount, erc20ABI } from 'wagmi'
import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'

import RouterABI from '../../pages/data/ABI/Router.json'




const SwapButton = ({ formikData, owner }) => {

    const [nftApproval, setNftApproval] = useState(false)


    const { data: nftApprovalData } = useContractRead({
        address: formikData.collection.address,
        abi: ERC721EnumABI,
        functionName: 'isApprovedForAll',
        args: [owner, formikData.golbalParams.router],
        watch: true,
        onSuccess(data) {
            if (data) {
                setNftApproval(true)
            }
        }
    })


    const { data: approveNFTData, write: approveNFT } = useContractWrite({
        address: formikData.collection.address,
        abi: ERC721EnumABI,
        functionName: 'setApprovalForAll',
        args: [formikData.golbalParams.router, true],
    })


    const { data: robustSwapNFTsForTokenData, write: swapNFTToToken, isSuccess: swapIsSuccess, isLoading: swapIsLoading } = useContractWrite({
        address: formikData.golbalParams.router,
        abi: RouterABI,
        functionName: 'robustSwapNFTsForToken',
        args: [formikData.tupleEncode, owner, (Date.parse(new Date()) / 1000 + 60 * 3600)],
        onSettled(data, error) {
            alert('settle', { data, error })
            console.log(data, error)
        }
    })


    const buttonText = () => {
        let text


        if (!formikData.collection.address || !formikData.token) {
            text = 'select nft and token first'
            return (<div>
                {text}
            </div>)
        }

        if (!nftApproval) {
            text = 'approve your nft to router'
            return (
                <button onClick={() => approveNFT()}>
                    {text}
                </button>
            )
        }

        if (formikData.isExceeded) {
            text = 'reduce nft amount'
            return (<div>
                {text}
            </div>)
        }

        text = 'swap'
        return (
            <>
                <button onClick={() => swapNFTToToken()}>
                    {swapIsLoading ? <div>Loading...</div> : <div>{text}</div>}
                </button>
                {swapIsLoading && <div>
                    <div className="alert alert-success">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Your purchase has been confirmed!</span>
                    </div>
                </div>}
                {/* {swapIsSuccess && <div>Transaction: {JSON.stringify(robustSwapNFTsForTokenData)}</div>} */}
            </>
        )
    }


    if (!owner) return (
        <div className='mx-6 p-12'>
            <ConnectButton />
        </div>
    )


    return (
        <div className="btn mx-6 p-12">
            {buttonText()}
        </div>
    )
}

export default SwapButton