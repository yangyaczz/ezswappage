import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'

import {ConnectButton} from '@rainbow-me/rainbowkit'
import {useNetwork, useContractRead, useContractReads, useContractWrite, useAccount, erc20ABI, useWaitForTransaction} from 'wagmi'
import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'
import styles from "./index.module.scss";
import RouterABI from '../../pages/data/ABI/Router.json'
import {Alert, AlertTitle, Box, CircularProgress, Snackbar} from "@mui/material";


const SwapButton = ({formikData, owner, reset23}) => {

    const [nftApproval, setNftApproval] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {data: nftApprovalData} = useContractRead({
        address: formikData.collection.address,
        abi: ERC721EnumABI,
        functionName: 'isApprovedForAll',
        args: [owner, formikData.golbalParams.router],
        watch: true,
        onSuccess(data) {
            // console.log('SwapButton isApprovedForAll', data)
            // if (data) {
                setNftApproval(data)
            // }
        }
    })

    const {data: approveNFTData, isLoading: approveLoading, isSuccess: approveSuccess, write: approveNFT,status: approveStatus,error:approveError} = useContractWrite({
        address: formikData.collection.address,
        abi: ERC721EnumABI,
        functionName: 'setApprovalForAll',
        args: [formikData.golbalParams.router, true],
    })

    const {data: robustSwapNFTsForTokenData, isLoading, isSuccess, write: swapNFTToToken, status: swapStatus,error:swapError} = useContractWrite({
        address: formikData.golbalParams.router,
        abi: RouterABI,
        functionName: 'robustSwapNFTsForToken',
        args: [formikData.tupleEncode, owner, (Date.parse(new Date()) / 1000 + 60 * 3600)],
    })
    const {waitApproveData, waitApproveIsError, isLoading: waitApproveLoading} = useWaitForTransaction({
        hash: approveNFTData?.hash,
        confirmations: 1,
        onSuccess(data) {
            // console.log(robustSwapNFTsForTokenData?.hash, data)
            setState({...{message: 'Approve Success', open: true}, open: true});
            doSwapNFTToToken()
        },
        onError(err) {
            console.log('approve tx error data ', robustSwapNFTsForTokenData?.hash, err);
            setState({...{message: 'Approve Fail', open: true}, open: true});
        }
    })

    const {data, isError, isLoading: waitTrxLoading} = useWaitForTransaction({
        hash: robustSwapNFTsForTokenData?.hash,
        confirmations: 1,
        onSuccess(data) {
            // console.log(robustSwapNFTsForTokenData?.hash, data)
            setState({...{message: 'Swap Success', open: true}, open: true});
            reset23()
        },
        onError(err) {
            console.log('approve tx error data ', robustSwapNFTsForTokenData?.hash, err);
            setState({...{message: 'Swap Fail', open: true}, open: true});
        }
    })

    function doApprove() {
        approveNFT()
        setState({...{message: 'Swap Success', open: true}, open: true});
    }

    function doSwapNFTToToken() {
        // if (formikData.isExceeded) {
        //     setErrorMsg('Reduce Nft Amount')
            // return;
        // }
        swapNFTToToken()
    }

    useEffect(() => {
        if (approveStatus === 'error') {
            if (approveError.message.indexOf('token owner or approved') > -1) {
                setState({...{message: 'caller is not token owner or approved', open: true}, open: true});
            }else if (approveError.message.indexOf('insufficient funds') > -1) {
                setState({...{message: 'insufficient funds', open: true}, open: true});
            }else {
                setState({...{message: 'approve error', open: true}, open: true});
            }
        }
    }, [approveStatus]);

    useEffect(() => {
        if (swapStatus === 'error') {
            if (swapError.message.indexOf('token owner or approved') > -1) {
                setState({...{message: 'caller is not token owner or approved', open: true}, open: true});
            }else if (swapError.message.indexOf('insufficient funds') > -1) {
                setState({...{message: 'insufficient funds', open: true}, open: true});
            }else {
                setState({...{message: 'swap error', open: true}, open: true});
            }
        }
    }, [swapStatus]);


    const [state, setState] = useState({
        open: false,
        message: 'Swap Success'
    });
    const {message, open} = state;

    const handleClose = () => {
        setState({...state, open: false});
    };
    const buttonText = () => {
        let text
        if (!formikData.collection.address) {
            text = 'Select a Collection'
            return (<div>{text}</div>)
        }
        if (!formikData.selectIds.length > 0) {
            text = 'Select a NFT'
            return (<div>{text}</div>)
        }

        if (!nftApproval) {
            text = 'Approve'
            return (<button onClick={() => doApprove()}>{approveLoading || waitApproveLoading ? <span class="loading loading-spinner loading-sm"></span> : text}</button>)
        }

        text = 'Swap'
        return (
            <div>
                <button onClick={() => doSwapNFTToToken()}>{isLoading || waitTrxLoading ? <span class="loading loading-spinner loading-sm"></span> : text}</button>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={open}
                    onClose={handleClose}
                    message={message}
                    key={'topright'}
                />
            </div>
        )
    }

    if (!owner) return (
        <div className='mx-6 p-6'>
            <ConnectButton/>
        </div>
    )

    return (
        <div>
            <div className={'btn' + " " + 'mx-6' + " " + styles.swapButton}>
                {buttonText()}
            </div>
            <div>
                {errorMsg}
            </div>
        </div>
    )
}

export default SwapButton
