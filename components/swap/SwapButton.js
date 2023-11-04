import React, { useState } from 'react'
import { ethers } from 'ethers'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useNetwork, useContractRead, useContractReads, useContractWrite, useAccount, erc20ABI } from 'wagmi'
import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'

import RouterABI from '../../pages/data/ABI/Router.json'


// robustSwapETHForSpecificNFTs

const SwapButton = ({ swapType, formikData, owner }) => {

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
            console.log(data, error)
        }
    })

    const { data: robustSwapETHForSpecificNFTsData, write: swapETHToNFT, isSuccess: swapETHToNFTIsSuccess, isLoading: swapETHToNFTIsLoading } = useContractWrite({
        address: formikData.golbalParams.router,
        abi: RouterABI,
        functionName: 'robustSwapETHForSpecificNFTs',
        args: [
            formikData.tupleEncode,
            owner,
            owner,
            (Date.parse(new Date()) / 1000 + 60 * 3600)
        ],
        overrides: {
            value: formikData.totalGet ? ethers.utils.parseEther(formikData.totalGet.toString()) : 0,
        },
        onSettled(data, error) {
            console.log(data, error)
            console.log(formikData.tupleEncode)
            console.log('totalGet', formikData.totalGet)
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

        if (swapType === 'sell') {
            return (
                <>
                    <button onClick={() => swapNFTToToken()}>
                        {swapIsLoading ? <div>Loading...</div> : <div>{text}</div>}
                    </button>
                </>
            )
        } else if (swapType === 'buy') {
            text = 'swappp'
            return (
                <>
                    <button onClick={() => swapETHToNFT()}>
                        {swapIsLoading ? <div>Loading...</div> : <div>{text}</div>}
                    </button>
                </>
            )
        } else {
            return null
        }
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

// [
//     [
//         [
//             "0x449dbf54f3a8dc9ab3796849c3c88c7907364c68",
//             [
//                 "54"
//             ],
//             [
//                 1
//             ]
//         ],
//         {
//             "type": "BigNumber",
//             "hex": "0x2b7d4e799fe000"
//         }
//     ]
// ]