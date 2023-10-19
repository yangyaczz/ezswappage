import React, { useState } from 'react'
import { ethers } from 'ethers';

import { useSendTransaction, usePrepareSendTransaction, useContractWrite } from 'wagmi'

const PoolCard = ({ item }) => {

    const [depositInputValue, setDepositInputValue] = useState('');  // 用于存储输入框的值
    const [depositError, setdepositError] = useState(false);  // 用于存储输入框的值



    const handleDepositInputChange = (e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setDepositInputValue(e.target.value);
            setdepositError(false)
        } else {
            setdepositError(true)
        }
    };

    const handleDeposit = () => {
        depositETH()
    };


    /////////////////////////////////////////////////

    const { data: depositETHData, sendTransaction: depositETH, isLoading: depositETHIsLoading, isSuccess: depositETHIsSuccess } = useSendTransaction({
        request: {
            to: depositInputValue ? item.id : null,
            value: !depositInputValue ? null : ethers.utils.parseEther(depositInputValue.toString()),
        },

        onError(error) {
            console.log('Error', error)
            console.log('Error', error.message)
        },
    })



    // const { data: robustSwapNFTsForTokenData, write: swapNFTToToken, isSuccess: swapIsSuccess, isLoading: swapIsLoading } = useContractWrite({
    //     address: formikData.golbalParams.router,
    //     abi: RouterABI,
    //     functionName: 'robustSwapNFTsForToken',
    //     args: [formikData.tupleEncode, owner, (Date.parse(new Date()) / 1000 + 60 * 3600)],
    //     onSettled(data, error) {
    //         alert('settle', { data, error })
    //         console.log(data, error)
    //     }
    // })


    return (
        <div className="flex flex-col bg-base-100 shadow-md p-6 rounded-lg mb-4">
            <div className="flex flex-row justify-between mb-4">
                <span className="text-sm text-white p-1 rounded-md bg-base-200 border border-gray-300">{item.id}</span>
                <span className="text-sm text-white">Balance: {item.tokenBalance} Token and {item.nftCount} NFT</span>
            </div>
            <div className="mb-4">
                <span className="text-lg font-medium">{item.tokenName} - {item.NFTName}</span>
            </div>
            <div className="flex justify-between p-4 rounded-lg bg-base-200 ">
                <div className='flex flex-col'>
                    <span className=" text-white">Current Price</span>
                    <span className=" text-gray-500">{item.currentPrice}</span>
                </div>
                <div className='flex flex-col'>
                    <span className=" text-white">Bonding Curve</span>
                    <span className=" text-gray-500">{item.BondingCurveName}</span>
                </div>
                <div className='flex flex-col'>
                    <span className=" text-white">Pool Type</span>
                    <span className=" text-gray-500">{item.poolTypeName}</span>
                </div>
                <div className='flex flex-col'>
                    <span className="text-white">Delta</span>
                    <span className="text-gray-500">{item.deltaText}</span>
                </div>

            </div>

            <div className='flex justify-end space-x-3'>
                <button className='btn mt-3 w-1/6' onClick={() => document.getElementById(`deposit_token_${item.id}`).showModal()}>
                    deposit token
                </button>

                <dialog id={`deposit_token_${item.id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Deposit Token:</h3>

                        <div className="flex space-x-4 items-center">
                            <input
                                type="text"
                                className="border p-2 rounded-md"
                                placeholder="Enter Amount"
                                value={depositInputValue}
                                onChange={handleDepositInputChange}
                            />
                            <button className="btn" onClick={handleDeposit}>Deposit</button>
                        </div>
                        <div>
                            {depositError && 'invalid number'}
                        </div>

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>


                {/* /////////////////////////////////////////// */}


                <button className='btn mt-3 w-1/6'>withdraw token</button>
            </div>

        </div>
    )
}

export default PoolCard