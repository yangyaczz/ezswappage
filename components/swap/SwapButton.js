import React, {useState} from 'react'
import {ethers} from 'ethers'

import {ConnectButton} from '@rainbow-me/rainbowkit'
import {useNetwork, useContractRead, useContractReads, useContractWrite, useAccount, erc20ABI} from 'wagmi'
import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'

import RouterABI from '../../pages/data/ABI/Router.json'
import {Alert, AlertTitle, Box, CircularProgress, Snackbar} from "@mui/material";


const SwapButton = ({formikData, owner}) => {

    const [nftApproval, setNftApproval] = useState(false)


    const {data: nftApprovalData} = useContractRead({
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


    const {data: approveNFTData,isLoading:approveLoading,isSuccess:approveSuccess, write: approveNFT} = useContractWrite({
        address: formikData.collection.address,
        abi: ERC721EnumABI,
        functionName: 'setApprovalForAll',
        args: [formikData.golbalParams.router, true],
    })


    const {data: robustSwapNFTsForTokenData,isLoading,isSuccess, write: swapNFTToToken} = useContractWrite({
        address: formikData.golbalParams.router,
        abi: RouterABI,
        functionName: 'robustSwapNFTsForToken',
        args: [formikData.tupleEncode, owner, (Date.parse(new Date()) / 1000 + 60 * 3600)],
    })

    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ ...newState, open: true });
    };
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const buttonText = () => {
        let text

        if (!formikData.collection.address || !formikData.token) {
            text = 'Select a nft'
            return (<div>{text}</div>)
        }

        if (!nftApproval) {
            text = 'approve'
            return (
                <button onClick={() => approveNFT()}>
                    {approveLoading?<Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>:text}
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
            <div>
                <button onClick={() => swapNFTToToken()}>
                {isLoading?<Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>:text}
            </button>
            </div>
        )
    }

    if (!owner) return (
        <div className='mx-6 p-6'>
            <ConnectButton/>
        </div>
    )

    return (
        <div className="btn mx-6">
            {buttonText()}
        </div>
    )
}

export default SwapButton
