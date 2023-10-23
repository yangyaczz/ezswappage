import React, { useState } from 'react'
import { ethers } from 'ethers';

import { useSendTransaction, useContractWrite } from 'wagmi'

const PoolCard = ({ item }) => {

    const [depositInputValue, setDepositInputValue] = useState('');
    const [withdrawInputValue, setWithdrawInputValue] = useState('');

    const [depositError, setDepositError] = useState('');
    const [withdrawError, setWithdrawError] = useState('');




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
        request: {
            to: depositInputValue ? item.id : null,
            value: !depositInputValue ? null : ethers.utils.parseEther(depositInputValue.toString()),
        },
        onError(error) {
            console.log('Error', error)
            console.log('Error', error.message)
        },
    })



    const { data: withdrawETHData, write: withdrawETH } = useContractWrite({
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
            console.log(data, error)
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
        onSettled(data, error) {
            console.log(data, error)
        }
    })


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
                            <button className="btn" onClick={() => depositETH?.()}>Deposit</button>
                        </div>
                        <div className='text-red-600'>
                            {depositError}
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


                <button className='btn mt-3 w-1/6' onClick={() => document.getElementById(`withdraw_token_${item.id}`).showModal()}>
                    withdraw token
                </button>

                <dialog id={`withdraw_token_${item.id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Withdraw Token:</h3>

                        <div className="flex space-x-4 items-center">
                            <input
                                type="text"
                                className="border p-2 rounded-md"
                                placeholder="Enter Amount"
                                value={withdrawInputValue}
                                onChange={handleWithdrawInputChange}
                            />
                            <button className="btn" onClick={() => withdrawETH?.()}>Withdraw</button>
                        </div>
                        <div className='text-red-600'>
                            {withdrawError}
                        </div>

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>





            </div>

        </div>
    )
}

export default PoolCard