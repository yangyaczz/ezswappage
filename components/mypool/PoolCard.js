import React, {useEffect, useRef, useState} from 'react'
import { ethers } from 'ethers';

import {useSendTransaction, useContractWrite, useBalance, useContractRead, useWaitForTransaction, useNetwork} from 'wagmi'
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import styles from './index.module.scss'
import addressSymbol from "@/pages/data/address_symbol";
import { useLanguage } from '@/contexts/LanguageContext';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import networkConfig from "../../pages/data/networkconfig.json";


const PoolCard = ({ item,formikData, owner, comeFrom }) => {
    const [nftApproval, setNftApproval] = useState(false)
    const [depositInputValue, setDepositInputValue] = useState('');
    const [withdrawInputValue, setWithdrawInputValue] = useState('');

    const [depositError, setDepositError] = useState('');
    const [withdrawError, setWithdrawError] = useState('');
    const [addressSelectNFT, setAddressSelectNFT] = useState([]);
    const [selectNFTs, setSelectNFTs] = useState([]);
    const [actionStatus, setActionStatus] = useState("");
    const [userHaveNFTs721, setUserHaveNFTs721] = useState([]);
    const [userHaveNFTs1155, setUserHaveNFTs1155] = useState(0);
    const [loadingNFT, setLoadingNFT] = useState(false);
    const tooltipRef = useRef("");
    const { chain } = useNetwork();

    const {languageModel} = useLanguage();

    const handleDepositInputChange = (e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setDepositInputValue(e.target.value);
            setDepositError('')
        } else {
            setDepositError('invalid number')
        }
    };

    const handleWithdrawInputChange = (e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setWithdrawInputValue(e.target.value);
            setWithdrawError('')
        } else {
            setWithdrawError('invalid number')
        }
    };

    /////////////////////////////////////////////////

    const { data: depositETHData, sendTransaction: depositETH, isLoading: depositETHIsLoading, isSuccess: depositETHIsSuccess } = useSendTransaction({
        to: depositInputValue ? item.id : null,
        value: !depositInputValue ? null : ethers.utils.parseEther(depositInputValue.toString()),
        onError(error) {
            showErrorAlert('Operate Fail');
            console.log(error)
        }
    })
    const { data: withdrawETHData, write: withdrawETH,isLoading: withdrawETHLoading } = useContractWrite({
        address: withdrawInputValue ? item.id : null,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawETH",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'withdrawETH',
        args: [!withdrawInputValue ? null : ethers.utils.parseEther(withdrawInputValue.toString())],
        onSettled(data, error) {
            showErrorAlert('Operate Fail');
            console.log(data, error)
        },
        onError(err) {
            showErrorAlert('Operate Fail');
        }
    })
    const { data: withdrawERC20Data, write: withdrawERC20 } = useContractWrite({
        address: item.id,
        abi: [{
            "inputs": [
                {
                    "internalType": "contract ERC20",
                    "name": "a",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawERC20",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'withdrawERC20',
        args: [item.token],
        onError(err) {
            showErrorAlert('Withdraw Fail');
        }
    })
    const {isLoading: depositOrWithdrawETHingLoading} = useWaitForTransaction({
        hash: depositETHData?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Deposit ' + item.tokenName + ' Success')
        },
        onError(err) {
            showErrorAlert('Deposit ' + item.tokenName + ' Fail');
            console.log(err)
        }
    })
    const {isLoading: withdrawETHingLoading} = useWaitForTransaction({
        hash: withdrawETHData?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Withdraw ' + item.tokenName + ' Success')
        },
        onError(err) {
            showErrorAlert('Withdraw ' + item.tokenName + ' Fail');
            console.log(err)
        }
    })

    const {data: nftApprovalData,refetch: isApproveRefetch} = useContractRead({
        address: item.collection,
        abi: ERC721EnumABI,
        functionName: 'isApprovedForAll',
        args: [owner, formikData.values.golbalParams.factory],
        watch: false,
        enabled: false
    })
    const {data: approveNFTData, isLoading: approveLoading, isSuccess: approveSuccess, write: approveNFT,status: approveStatus,error:approveError} = useContractWrite({
        address: item.collection,
        abi: ERC721EnumABI,
        functionName: 'setApprovalForAll',
        args: [formikData.values.golbalParams.factory, true],
    })
    const {waitApproveData, waitApproveIsError, isLoading: approvingLoading} = useWaitForTransaction({
        hash: approveNFTData?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Approve Success')
            if (item.tokenType === 'ERC721'){
                depositNFT()
            }else {
                depositERC1155()
            }
        },
        onError(err) {
            showErrorAlert('Approve Fail');
        }
    })

    const { data: depositNFTData, write: depositNFT,isLoading: depositLoading } = useContractWrite({
        address: formikData.values.golbalParams.factory,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nft",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "depositNFTs",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'depositNFTs',
        args: [item.collection,selectNFTs,item.id],
        onError(err) {
            showErrorAlert('Deposit Fail', err);
        }
    })
    const {data, isError, isLoading: depositingLoading} = useWaitForTransaction({
        hash: depositNFTData?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Deposit Success')
            document.getElementById(`deposit_nft_${item.id}`).close()
            setLoadingNFT(false)
        },
        onError(err) {
            showErrorAlert('Deposit Fail', err);
        }
    })

    const { data: depositNFT1155Data,isLoading: deposit1155Loading, write: depositNFT1155 } = useContractWrite({
        address: formikData.values.golbalParams.factory,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nft",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "counts",
                    "type": "uint256[]"
                }
            ],
            "name": "depositNFTs1155",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'depositNFTs1155',
        args: [item.collection,[item.nftId1155],item.id,[depositInputValue]],
        onError(err) {
            showErrorAlert('Deposit Fail', err);
        }
    })
    const {data2, isError2, isLoading: deposit1155ingLoading} = useWaitForTransaction({
        hash: depositNFT1155Data?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Deposit Success')
            document.getElementById(`deposit_nft_${item.id}`).close()
            setLoadingNFT(false)
        },
        onError(err) {
            showErrorAlert('Deposit Fail', err);
        }
    })

    const { data: withdrawNFTData,isLoading: withdrawLoading, write: withdrawNFT } = useContractWrite({
        address: item.id,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nft",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                }
            ],
            "name": "withdrawERC721",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'withdrawERC721',
        args: [item.collection,selectNFTs],
        onError(error) {
            console.log(error)
        }
    })
    const {data3, isError3, isLoading: withdrawingLoading} = useWaitForTransaction({
        hash: withdrawNFTData?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Withdraw Success')
            document.getElementById(`withdraw_nft_${item.id}`).close()
            setLoadingNFT(false)
        },
        onError(err) {
            console.log('123')
            showErrorAlert('Withdraw Fail');
        }
    })

    const { data: withdrawNFT1155Data,isLoading: withdraw1155Loading, write: withdrawNFT1155 } = useContractWrite({
        address: item.id,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nft",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "name": "withdrawERC1155",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'withdrawERC1155',
        args: [item.collection,[item.nftId1155],[withdrawInputValue]],
        onSettled(data, error) {
            if (error?.toString()?.includes('insufficient balance for')) {
                showErrorAlert('Insufficient funds');
            }
            console.log(data, error)
        },
        onError(err) {
            console.log('123')
            showErrorAlert('Withdraw Fail');
        }
    })
    const {data4, isError4, isLoading: withdraw1155ingLoading} = useWaitForTransaction({
        hash: withdrawNFT1155Data?.hash,
        confirmations: 1,
        onSuccess(data) {
            showSuccessAlert('Withdraw Success')
            document.getElementById(`withdraw_nft_${item.id}`).close()
            setLoadingNFT(false)
        },
        onError(err) {
            showErrorAlert('Withdraw Fail');
        }
    })

    const { data: tokenAmount1155,refetch: balanceOfRefetch } = useContractRead({
        address: item.tokenType === 'ERC1155' && item.collection,
        abi: ERC1155ABI,
        functionName: 'balanceOf',
        args: [actionStatus === 'deposit' ? owner : item.id, item.nftId1155],
        watch: false,
        enabled: false
    })

    const {data: tokensOfOwnerData, refetch: tokensOfOwnerRefetch} = useContractRead({
        address: item.tokenType === 'ERC721' && item.collection,
        abi: ERC721EnumABI,
        functionName: 'tokensOfOwner',
        args: actionStatus === 'deposit' ? [owner] : [item.id],
        watch: false,
        enabled: false
    })

    const openNFTDialog = async (item,action) => {
        await setActionStatus(action)
        const networkName = formikData.values.golbalParams.networkName;
        const networkType = formikData.values.golbalParams.hex;
        setLoadingNFT(true)
        if (networkType === '0x3cc5' ||networkType === '0x4571') {
            // eos链
            console.log('item', item)
            if (item.tokenType === 'ERC721') {
                console.log('formikData', formikData)
                if (item.collection === "0x31753b319f03a7ca0264A1469dA0149982ed7564") {
                    const params = {
                        address: action === 'deposit' ? owner : item.id,
                    };
                    const response = await fetch("/api/queryECHOUserHaveToken", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    });
                    const data = await response.json();
                    if (data.success) {
                        setAddressSelectNFT([])
                        let tempList = []
                        if (data.data !== undefined){
                            for (const datum of data?.data) {
                                const obj ={
                                    "identifier":datum.tokenId
                                }
                                tempList.push(obj)
                            }
                        }
                        setAddressSelectNFT(tempList)
                        setLoadingNFT(false)
                    }
                } else {
                    const resultData = await tokensOfOwnerRefetch()
                    setAddressSelectNFT([])
                    let tempList = []
                    console.log('resultData', resultData)
                    if (resultData !== undefined && resultData.data !== undefined){
                        for (const datum of resultData?.data) {
                            const obj ={
                                "identifier":parseInt(datum)
                            }
                            tempList.push(obj)
                        }
                    }
                    setAddressSelectNFT(tempList)
                    setLoadingNFT(false)
                }
            }else {
                const num=await balanceOfRefetch()
                const nftCount = parseInt(num.data)
                setUserHaveNFTs1155(nftCount)
                setLoadingNFT(false)
            }
        }else if (networkType === '0x34816d' ||networkType === '0xa9'){
            // manta链
            let params
            if (item.NFTName === 'Mars' || item.NFTName === 'M404'){
                const params = {
                    ownerAddress: action === 'deposit' ? owner : item.id,
                    contractAddress: item.collection.toLowerCase(),
                    mode: networkConfig[chain.id].networkName,
                };
                const response = await fetch("/api/queryOwnerNFT", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });
                const data = await response.json();
                setLoadingNFT(false)

                let tokenIdList = []
                for (const tokenItem of data?.data) {
                    var obj = {
                        identifier: tokenItem.tokenId
                    }
                    console.log('tokenItem', tokenItem, tokenItem.tokenId)
                    tokenIdList.push(obj)
                }
                setAddressSelectNFT(tokenIdList)
                // console.log('tokenIdList', tokenIdList)
            }else {
                if (item.tokenType === 'ERC721') {
                    // 721
                    params = {
                        query: `
                                {
                                    erc721Tokens(where: { owner: "${action==='deposit'?owner.toLowerCase():item.id}", contract: "${item.collection}" }) {
                                      identifier
                                    }
                                }
                                `,
                        urlKey: networkName,
                    };
                }else {
                    // 1155
                    let nftAddress = item.collection;
                    let tid = "0x" + item.nftId1155.toString(16);
                    let parseStr = (nftAddress + "/" + tid + "/" + (action==='deposit'?owner:item.id)).toLowerCase();
                    params = {
                        query: `
                                {
                                    erc1155Balances(
                                      where: {id: "${parseStr}"}
                                    ) {
                                      valueExact
                                    }
                                }
                                `,
                        urlKey: networkName,
                    };
                }
                console.log('params', params)
                const response = await fetch("/api/queryMantaNFT", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });
                const data = await response.json();
                if (item.tokenType==='ERC721'){
                    console.log('data.data.erc721Tokens', data.data.erc721Tokens)
                    setAddressSelectNFT(data.data.erc721Tokens)
                }else {
                    console.log('1155 manta count', data)
                    setUserHaveNFTs1155(data.data.erc1155Balances[0]?.valueExact)
                }
                setLoadingNFT(false)
            }
        }else {
            setLoadingNFT(true)
            let frontText = ''
            console.log('formikData', formikData.values)
            if (formikData.values.golbalParams.networkName === 'ethmain') {
                frontText = 'eth-mainnet'
            } else if (formikData.values.golbalParams.networkName === 'arbmain') {
                frontText = 'arb-mainnet'
            }
            const params = {
                url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
                owner: action==='deposit'?owner:item.id,
                contractAddress: item.collection,
                withMetadata: false,
                pageSize: 1000
            };

            const response = await fetch("/api/queryNFTByAlchemy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            let data = await response.json();
            console.log('datadata', data.ownedNfts)
            let tokenIdList = []
            for (const tokenItem of data?.ownedNfts) {
                var obj = {
                    identifier: tokenItem.tokenId
                }
                console.log('tokenItem', tokenItem, tokenItem.tokenId)
                tokenIdList.push(obj)
            }
            if (item.tokenType==='ERC721'){
                setAddressSelectNFT(tokenIdList)
            }else {
                // console.log('1155 manta count', data)
                // setUserHaveNFTs1155(data.data.erc1155Balances[0]?.valueExact)
            }
            setLoadingNFT(false)
        }
        if (action==='deposit') {
            document.getElementById(`deposit_nft_${item.id}`).showModal()
        }else {
            document.getElementById(`withdraw_nft_${item.id}`).showModal()
        }

    }


    const toggleSelected = async (tokenId) => {
        console.log('tokenId',tokenId)
        if (selectNFTs.includes(tokenId)) {
            setSelectNFTs(selectNFTs.filter((nftId) => nftId !== tokenId))
        } else {
            setSelectNFTs([...selectNFTs, tokenId])
        }
    }


    const doDepositNFT = async () => {
        if (item.tokenType==='ERC721'){
            if (selectNFTs.length===0){
                return
            }else {
                const approveResult =await isApproveRefetch()
                console.log('approveResult', approveResult)
                if (approveResult.data) {
                    await depositNFT()
                }else {
                    await approveNFT()
                }
            }
        }
        if (item.tokenType==='ERC1155'){
            if (depositInputValue===0 || depositInputValue===''){
                return
            }else {
                const approveResult =await isApproveRefetch()
                console.log('approveResult', approveResult)
                if (approveResult.data) {
                    depositNFT1155()
                }else {
                    console.log('[item.collection,[item.nftId1155],item.id,[depositInputValue]]', [item.collection,[item.nftId1155],item.id,[depositInputValue]])
                    await approveNFT()
                }
            }
        }

    }
    const doWithdrawNFT = async () => {
        await withdrawNFT()
    }

    // alert
    const svgError = (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
    const svgSuccess = (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)

    const [alertText, setAlertText] = useState({
        className: '',
        text: '',
        svg: '',
    })
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showAlert]);

    function showErrorAlert(msg) {
        setAlertText({
            className: 'alert-error',
            text: msg,
            svg: svgError,
        })
        setShowAlert(true);
    }

    function showSuccessAlert(msg) {
        setAlertText({
            className: 'alert-success',
            text: msg,
            svg: svgSuccess,
        })
        setShowAlert(true);
    }
    // alert

    return (
        <div className="flex flex-col p-6 mb-4 rounded-lg shadow-md border border-solid border-white">
            <div className="mb-1 flex justify-between">
                <div className="flex lg:items-center max-[800px]:flex-col">
                    <span className="text-white	text-xl lg:text-2xl font-bold mr-4">{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName} - {item.NFTName}</span>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap">
                        {languageModel.Balance}:
                        {Math.floor(item.tokenBalance*10000)/10000}&nbsp;{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName} {languageModel.And} {item.tokenType==='ERC721'?item.nftCount:item.nftCount1155} NFT
                    </span>
                </div>
                <div>
                    <div className="flex items-center justify-start gap-x-2 max-[800px]:mt-1">
                        <div
                            className="flex items-center gap-x-2  bg-[rgba(82,82,91,0.8)] opacity-80 px-3 sm:px-1 lg:px-3 py-[0.1rem] rounded-md cursor-pointer hover:bg-[rgba(63,63,70,0.8)] hover:text-white tooltip tooltip-top"
                            data-tip={languageModel.copyAddress}
                            ref={tooltipRef}
                            onMouseEnter={() => {
                                console.log(tooltipRef)
                                tooltipRef.current.setAttribute(
                                    "data-tip",
                                    languageModel.copyAddress
                                );
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(item.id);
                                tooltipRef.current.setAttribute("data-tip", languageModel.Copied);
                            }}
                        >
                            <FontAwesomeIcon icon={faCopy} size="xs" />
                            <label className="self-end min-[500px]:text-xs text-[9px] align-baseline cursor-pointer text-end">{`${item.id.substring(
                                0,
                                5
                            )}......${item.id.substring(
                                item.id.length - 4
                            )}`}</label>
                        </div>
                    </div>
                    {/*<span className="p-1 text-sm text-white border border-gray-300 rounded-md bg-base-200">{`${item.id.substring(0, 5)}...${item.id.substring(item.id.length - 4)}`}</span>*/}
                </div>

                {/*<div className="flex flex-row justify-between mb-4 max-[799px]:items-center">*/}
                {/*    <span className="text-sm text-white">*/}
                {/*        {languageModel.Balance}:*/}
                {/*            {Math.floor(item.tokenBalance*10000)/10000}&nbsp;{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName} {languageModel.And} {item.tokenType==='ERC721'?item.nftCount:item.nftCount1155} NFT*/}
                {/*    </span>*/}
                {/*</div>*/}
            </div>
            <div className="min-[800px]:flex min-[800px]:justify-between py-4 rounded-lg bg-base-200 bg-black ">
                <div className='flex min-[800px]:flex-col max-[799px]:items-center'>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[799px]:mr-4">{languageModel.CurrentPrice}</span>
                    {item.type === "1" && <span className="lg:mt-1 text-gray-500 ">{item.currentBuyPrice === undefined? `0` :` ${parseFloat(Number(item.currentBuyPrice).toFixed(5))}`}&nbsp;{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName}</span>}
                    { item.type === "0" && <span className="lg:mt-1 text-gray-500 ">{item.currentSellPrice === undefined? `0` :` ${parseFloat(Number(item.currentSellPrice).toFixed(5))}`}&nbsp;{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName}</span>}
                    { item.type === "2" && <span className="lg:mt-1 text-gray-500 ">buy&sell:&nbsp;{item.currentSellPrice === undefined? `0` :`${parseFloat(Number(item.currentBuyPrice).toFixed(5))} & ${parseFloat(Number(item.currentSellPrice).toFixed(5))}`}&nbsp;{item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName}</span>}
                </div>
                <div className='flex min-[800px]:flex-col max-[799px]:items-center max-[800px]:mt-1'>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[799px]:mr-4">{languageModel.BondingCurve}</span>
                    <button className="lg:mt-1 normal-case btn btn-outline btn-success btn-xs">{languageModel[item.BondingCurveName]}</button>

                    {/*<span className="text-gray-500 "></span>*/}
                </div>
                <div className='flex min-[800px]:flex-col max-[799px]:items-center max-[800px]:mt-1'>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[799px]:mr-4">{languageModel.PoolType}</span>
                    <span className="lg:mt-1 text-gray-500 capitalize ">{languageModel[item.poolTypeName.charAt(0).toUpperCase()+item.poolTypeName.slice(1)]}</span>
                </div>
                <div className='flex min-[800px]:flex-col max-[799px]:items-center max-[800px]:mt-1'>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[799px]:mr-4">{languageModel.Delta}</span>
                    <span className="lg:mt-1 text-gray-500">{item.BondingCurveName === 'Exponential' ? item.deltaText : parseFloat(item.deltaText) + " "+ (item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName) }</span>
                </div>
                <div className='flex min-[800px]:flex-col max-[799px]:items-center max-[800px]:mt-1'>
                    <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[799px]:mr-4">{languageModel.Volume}</span>
                    <span className="lg:mt-1 text-gray-500">{parseFloat(Number(item.ethVolume/1000000000000000000.0).toFixed(5)) + " " +(item.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : item.tokenName)}</span>
                </div>

            </div>

            <div className='flex min-[800px]:justify-end max-[799px]:flex-col space-x-3'>
                <div className="flex justify-between">
                {/*deposit nft*/}
                    {comeFrom === 'myPool' && <button className='btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA] mr-3 max-[800px]:w-2/5' onClick={() => {openNFTDialog(item,'deposit');}}>
                    {loadingNFT && actionStatus==='deposit'?<span className="loading loading-spinner loading-sm"></span>:<span>{languageModel.DepositNFT}</span>}
                </button>}
                <dialog id={`deposit_nft_${item.id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">{languageModel.DepositNFT}{item.tokenType==='ERC1155' && " ("+userHaveNFTs1155+") "}:</h3>
                        <div className="flex flex-wrap justify-center">
                        {
                            item.tokenType==='ERC721' ?
                                addressSelectNFT.length === 0 ? <span className="mb-4">{languageModel.YouDontHaveThisNFT}</span>:addressSelectNFT.map((square, index) => (
                            <div
                                key={index}
                                data-tip={
                                    addressSelectNFT.length===0 && languageModel.YouDontHaveThisNFT
                                }
                                className={`
                                p-3 mr-2 mb-5 cursor-pointer
                                    ${selectNFTs.includes(square.identifier) && "bg-[#28B7BC3B]"}
                                `}
                                onClick={() => {
                                    toggleSelected(square.identifier);
                                }}>
                                {selectNFTs.includes(square.identifier) && (
                                    <img className="absolute w-6" src="/yes.svg" alt="" />
                                )}
                                <img className="w-20" src={formikData.values.golbalParams.recommendNFT.filter(officer => officer.address.toLowerCase() === item.collection.toLowerCase())[0]?.img} alt="" />
                                <div className="mt-1 text-center">#{square.identifier}</div>
                            </div>
                        ))
                                :
                            <div className="flex items-center mt-4 mb-4 space-x-4">
                                <input
                                    type="text"
                                    className="p-2 border rounded-md"
                                    placeholder={languageModel.EnterAmount}
                                    value={depositInputValue}
                                    onChange={handleDepositInputChange}
                                />
                            </div>
                        }
                        </div>
                        {/*721*/}
                        <div className='text-red-600'>
                            {depositError}
                        </div>
                        <div className="flex justify-center">
                            <button className="normal-case btn" onClick={() => doDepositNFT()}>{approvingLoading||approveLoading||deposit1155ingLoading||deposit1155Loading||depositLoading||depositingLoading?<span className="loading loading-spinner loading-sm"></span>:languageModel.Deposit}</button>
                        </div>
                        <form method="dialog">
                            <button className="absolute normal-case btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>{languageModel.Close}</button>
                    </form>
                </dialog>
                {/*deposit nft*/}
                {/*withdraw nft*/}
                    {comeFrom === 'myPool' && <button className='btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA] max-[800px]:w-2/5 mb-3' onClick={() => {openNFTDialog(item,'withdraw');}}>
                    {loadingNFT && actionStatus==='withdraw'?<span className="loading loading-spinner loading-sm"></span>:<span>{languageModel.WithdrawNFT}</span>}
                    </button>}
                <dialog id={`withdraw_nft_${item.id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">{languageModel.WithdrawNFT}:</h3>
                        <div className="flex justify-center flex-wrap">
                        {
                            item.tokenType==='ERC721' ?
                                addressSelectNFT.length === 0 ? <span className="mb-4">{languageModel.PoolDontHaveNFT}</span>:addressSelectNFT.map((square, index) => (
                                    <div
                                        key={index}
                                        data-tip={addressSelectNFT.length===0 && "pool don't have nft"}
                                        className={`p-3 mr-2 mb-5 cursor-pointer
                                        ${selectNFTs.includes(square.identifier) && "bg-[#28B7BC3B]"}`}
                                        onClick={() => {
                                            toggleSelected(square.identifier);
                                        }}>
                                        {selectNFTs.includes(square.identifier) && (
                                            <img className="absolute w-6" src="/yes.svg" alt="" />
                                        )}
                                        <img className="w-20" src={formikData.values.golbalParams.recommendNFT.filter(officer => officer.address.toLowerCase() === item.collection.toLowerCase())[0]?.img} alt="" />
                                        <div className="mt-1 text-center">#{square.identifier}</div>
                                    </div>
                                )):

                                <div className="flex items-center mt-4 mb-4 space-x-4">
                                    <input
                                        type="text"
                                        className="p-2 border rounded-md"
                                        placeholder={languageModel.EnterAmount}
                                        value={withdrawInputValue}
                                        onChange={handleWithdrawInputChange}
                                    />
                                </div>
                        }
                        </div>
                        {/*721*/}
                        <div className='text-red-600'>
                            {depositError}
                        </div>
                        <div className="flex justify-center">
                            <button className="normal-case btn" onClick={() => item.tokenType==='ERC721' ? doWithdrawNFT(): withdrawNFT1155()}>{withdraw1155Loading||withdraw1155ingLoading||withdrawLoading||withdrawingLoading?<span className="loading loading-spinner loading-sm"></span>:languageModel.Withdraw}</button>
                        </div>
                        <form method="dialog">
                            <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>{languageModel.Close}</button>
                    </form>
                </dialog>
                {/*withdraw nft*/}
                </div>

<div className="flex justify-between !ml-0 min-[800px]:!ml-4" >
    {comeFrom === 'myPool' && <button className='btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA] max-[800px]:w-2/5' onClick={() => document.getElementById(`deposit_token_${item.id}`).showModal()}>
                        {languageModel.DepositToken}
                    </button>}

                    <dialog id={`deposit_token_${item.id}`} className="modal">
                        <div className="modal-box">
                            <h3 className="mb-4 text-lg font-bold">{languageModel.DepositToken}:</h3>

                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    className="p-2 border rounded-md"
                                    placeholder={languageModel.EnterAmount}
                                    value={depositInputValue}
                                    onChange={handleDepositInputChange}
                                />
                                <button className="normal-case btn" onClick={() => depositETH?.()}>{depositOrWithdrawETHingLoading||depositETHIsLoading?<span className="loading loading-spinner loading-sm"></span>:languageModel.Deposit}</button>
                            </div>
                            <div className='text-red-600'>
                                {depositError}
                            </div>

                            <form method="dialog">
                                <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
                            </form>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button>{languageModel.Close}</button>
                        </form>
                    </dialog>


                    {/* /////////////////////////////////////////// */}


                    {comeFrom === 'myPool' && <button className='btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA] ml-3 max-[800px]:w-2/5' onClick={() => document.getElementById(`withdraw_token_${item.id}`).showModal()}>
                        {languageModel.WithdrawToken}
                    </button>}

                    <dialog id={`withdraw_token_${item.id}`} className="modal">
                        <div className="modal-box">
                            <h3 className="text-lg font-bold">{languageModel.WithdrawToken} (max: {Math.floor(item.tokenBalance*10000)/10000}):</h3>

                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    className="p-2 border rounded-md"
                                    placeholder={languageModel.EnterAmount}
                                    value={withdrawInputValue}
                                    onChange={handleWithdrawInputChange}
                                />
                                <button className="normal-case btn" onClick={() => withdrawETH?.()}>{withdrawETHingLoading||withdrawETHLoading?<span className="loading loading-spinner loading-sm"></span>:languageModel.Withdraw}</button>
                            </div>
                            <div className='text-red-600'>
                                {withdrawError}
                            </div>

                            <form method="dialog">
                                <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
                            </form>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button>{languageModel.Close}</button>
                        </form>
                    </dialog>
</div>
                {showAlert && <div className={styles.alertPosition}>
                    <div className={'alert'+" "+ alertText.className+ " "+styles.alertPadding}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{alertText.text}</span>
                    </div>
                </div>}
            </div>

        </div>
    )
}

export default PoolCard
