import React, {useState, useEffect, useRef} from 'react'
import {useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import ERC20ABI from "../data/ABI/ERC20.json";
import stakeAbi from "../data/ABI/stakeabi.json";
import AlertComponent from "../../components/common/AlertComponent";
import ERC721EnumABI from "../data/ABI/ERC721Enum.json";
import networkConfig from "../data/networkconfig.json";


const Staking = () => {

    const [tokenStake, setTokenStake] = useState(0);
    const [tokenLocked, setTokenLocked] = useState(0);
    const [tokenCanWithdraw, setTokenCanWithdraw] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [activeButton, setActiveButton] = useState(0);
    const [inputAmount, setInputAmount] = useState("");
    const alertRef = useRef(null);
    const [stakeLoading, setStakeLoading] = useState(false);
    const [tokenApproval, setTokenApproval] = useState(0);

    const {address: owner} = useAccount();
    const {chain} = useNetwork();

    // 测试版stake: 0x7fa3d06516ef2ca0272cf13e1445146691a5fc05
    // 测试版token: 0xB32eFC47Bf503B3593a23204cF891295a85115Ea

    // 正式版stake: 0x3C4Ac4F4716e5b8Dfd19c60C7801581605507237
    // 正式版token: 0x95d1b0f2a751010083bf12e29e7a2f13429f7143

    const stakeAddress = '0x3C4Ac4F4716e5b8Dfd19c60C7801581605507237'
    const constAddress = '0x95d1b0f2a751010083bf12e29e7a2f13429f7143'

    const {data: tokenAmount1155, refetch: balanceOfRefetch} = useContractRead({
        address: constAddress,
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('balance: ', parseInt(data))
            setTokenBalance(parseInt(data) / 1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: tokenAmount, refetch: balanceOfRefetch2} = useContractRead({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'stakes',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('setTokenStake: ', data)
            setTokenStake(parseInt(data) / 1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: tokenAmount4, refetch: balanceOfRefetch4} = useContractRead({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'getAvailableWithdrawAmount',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('getTotalUnstakedAmount: ', data)
            setTokenCanWithdraw(parseInt(data) / 1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: tokenAmount2, refetch: balanceOfRefetch3} = useContractRead({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'getUnwithdrawableUnstakedAmount',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('getTotalUnstakedAmount: ', data)
            setTokenLocked(parseInt(data) / 1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: nftApprovalData} = useContractRead({
        address: constAddress,
        abi: ERC20ABI,
        functionName: "allowance",
        args: [owner, stakeAddress],
        watch: true,
        onSuccess(data) {
            console.log('授权结果', data)
            setTokenApproval(parseInt(data))
        },
    });

    const {
        data: approveNFTData, isLoading: approveLoading, isSuccess: approveSuccess, write: approveTokenFunction, status: approveStatus, error: approveError,
    } = useContractWrite({
        address: constAddress,
        abi: ERC20ABI,
        functionName: "approve",
        args: [stakeAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935'],
        onError(err) {
            console.log('授权失败,', err)
            alertRef.current.showErrorAlert("Approve fail");
            setStakeLoading(false)
        },
        onSettled(data, error) {
            console.log('授权成功')
            if (error) {
                alertRef.current.showErrorAlert("Approve fail");
                setStakeLoading(false)
            }
        }
    });
    const {
        waitApproveData2,
        waitApproveIsError2,
        isLoading: waitApproveLoading2,
    } = useWaitForTransaction({
        hash: approveNFTData?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Approve Success");
            // setStakeLoading(false)
            stakeToken()
        },
        onError(err) {
            alertRef.current.showErrorAlert("Approve Fail");
            setStakeLoading(false)
        },
    });

    const {data: stakeResult, write: stakeToken, isLoading: mintNFTLoading} = useContractWrite({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'stake',
        args: [(inputAmount * 1e18).toLocaleString().replaceAll(',', '')],
        onError(error) {
            console.log(error)
            if (error.message.indexOf("User rejected the request") === -1) {
                alertRef.current.showErrorAlert("staking error"+ error.toString());
            }
            setStakeLoading(false)
        }
    })

    const {data: unStakeResult, write: unStakeTokenFunction, isLoading: unStakingLoading} = useContractWrite({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'unstake',
        args: [(inputAmount * 1e18).toLocaleString().replaceAll(',', '')],
        onError(error) {
            // alertRef.current.showErrorAlert("error", error);
            setStakeLoading(false)
            let errorMsg = "unstake error: ";
            if (error.message.indexOf("You have an unwithdrawn amount") > -1) {
                errorMsg += "You have an unwithdrawn amount, please withdraw and try again.";
            } else if (error.message.indexOf("Unstake balance error") > -1) {
                errorMsg += "Unstake balance error";
            }
            alertRef.current.showErrorAlert(errorMsg);
        }
    })

    const {data: withdrawResult, write: withdrawTokenFunction, isLoading: withdrawLoading} = useContractWrite({
        address: stakeAddress,
        abi: stakeAbi,
        functionName: 'withdraw',
        args: [],
        onError(error) {
            console.log('withdraw 错误', error.message)
            let errorMsg = "withdraw error: ";
            if (error.message.indexOf("No available amount to withdraw") > -1) {
                errorMsg += "No available amount to withdraw";
            } else if (error.message.indexOf("You have an unwithdrawn amount") > -1) {
                errorMsg += "You have an unwithdrawn amount, please withdraw and try again.";
            } else if (error.message.indexOf("Unstake balance error") > -1) {
                errorMsg += "Unstake balance error";
            }
            alertRef.current.showErrorAlert(errorMsg);
            setStakeLoading(false)
        }
    })

    const {
        waitApproveData,
        waitApproveIsError,
        isLoading: waitApproveLoading,
    } = useWaitForTransaction({
        hash: stakeResult?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Stake Success");
            setStakeLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Stake Fail");
            setStakeLoading(false)
        },
    });

    const {
        waitUnstakingData,
        waitUnstakingIsError,
        isLoading: unStakingResultLoading,
    } = useWaitForTransaction({
        hash: unStakeResult?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Unstaking Success");
            setStakeLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Unstaking Fail");
            setStakeLoading(false)
        },
    });

    const {
        waitWithdrawData,
        waitWithdrawIsError,
        isLoading: withdrawResultLoading,
    } = useWaitForTransaction({
        hash: withdrawResult?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Withdraw Success");
            setStakeLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Withdraw Fail");
            setStakeLoading(false)
        },
    });

    // useEffect(() => {
    //
    // })

    function changeState(step) {
        setActiveButton(step)
    }

    function maxOrHalf(step) {
        // 0: max,1.half
        if (activeButton === 0) {
            if (step === 0) {
                setInputAmount(tokenBalance)
            } else {
                setInputAmount(tokenBalance / 2)
            }
        } else if (activeButton === 1) {
            if (step === 0) {
                setInputAmount(tokenStake)
            } else {
                setInputAmount(tokenStake / 2)
            }
        }

    }

    function changeAmount(amount) {


        if (activeButton === 0) {
            if (amount > tokenBalance) {
                setInputAmount(tokenBalance)
            } else {
                setInputAmount(amount)
            }
        } else if (activeButton === 1) {
            if (amount > tokenStake) {
                setInputAmount(tokenStake)
            } else {
                setInputAmount(amount)
            }
        }
    }

    function confirm() {
        if (chain === undefined) {
            alertRef.current.showErrorAlert("please connect wallet");
            return;
        }
        console.log('chain.id', chain.id)
        if (chain.id !== 169 && chain.id !== 3441006) {
            alertRef.current.showErrorAlert("Please switch to manta chain");
            return;
        }
        if (activeButton !== 2) {
            if (inputAmount === 0 || inputAmount === '' || inputAmount === "0") {
                alertRef.current.showErrorAlert("Please input amount");
                return;
            }
        }
        // alertRef.current.showErrorAlert("error");
        setStakeLoading(true)
        if (activeButton === 0) {
            if (tokenApproval < inputAmount * 1e18) {
                approveTokenFunction()
            } else {
                stakeToken()
            }
        } else if (activeButton === 1) {
            unStakeTokenFunction()

        } else if (activeButton === 2) {
            withdrawTokenFunction()
        }
    }


    return (
        <div className="flex flex-col justify-center items-center text-white">
            <div className="text-6xl font-bold mt-20  max-[800px]:mt-5 mb-10 max-[800px]:text-3xl">STAKE $EZSWAP</div>

            <div className="flex justify-between w-[55%] max-[800px]:w-[85%]">
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%] max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/staking.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Staked</div>
                        <div>{tokenStake.toFixed(2)}</div>
                    </div>
                </div>
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center  border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%] max-[800px]:mx-3 max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/unstaking.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Unstaked</div>
                        {/*<div>{tokenUnstaked}</div>*/}
                        <div>{tokenCanWithdraw.toFixed(2)}</div>
                    </div>
                </div>
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center  border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%]  max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/lock.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Locked</div>
                        <div>{tokenLocked.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div className="border-t my-10 w-[50%] max-[800px]:w-[85%] border-[#00D5DA]"></div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 px-10 max-[800px]:px-3 w-[55%] mb-20 max-[800px]:w-[85%]">
                <div className="flex justify-center max-[800px]:flex-nowrap">
                    <ul className="menu menu-horizontal max-[800px]:p-0 max-[800px]:flex-nowrap	">
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5 max-[800px]:py-0 font-bold ${activeButton === 0 && 'bg-[#00D5DA] text-black'}`}><a className="max-[800px]:px-[0.3rem] " onClick={() => changeState(0)}>&nbsp;&nbsp;&nbsp;STAKE&nbsp;&nbsp;&nbsp;</a></li>
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5  max-[800px]:py-0 mx-10 max-[800px]:mx-3 font-bold ${activeButton === 1 && 'bg-[#00D5DA] text-black'}`}><a className="max-[800px]:px-[0.3rem] " onClick={() => changeState(1)}>&nbsp;UNSTAKE&nbsp;</a></li>
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5 max-[800px]:py-0 font-bold ${activeButton === 2 && 'bg-[#00D5DA] text-black'}`}><a className="max-[800px]:px-[0.3rem] " onClick={() => changeState(2)}>WITHDRAW</a></li>
                    </ul>
                </div>
                <div className="flex flex-col items-center justify-center max-[800px]:px-3">
                    <div className="block">
                        {
                            activeButton === 0 ?
                                <div className="my-10 max-[800px]:text-center">
                                    Staking $EZSWAP enables you to participate in future airdrop and launchpad. Newly-staked tokens will become eligible immediately.
                                </div> :
                                activeButton === 1 ?
                                    <div className="my-10 max-[800px]:text-center">
                                        Unstaking $EZSWAP enables you to withdraw them from the staking contract after a cooldown period (14 days) of one epoch once the current epoch ends. (Epochs start every Thursday at 00:00 UTC and last 7 days).
                                    </div> :
                                    <div className="my-10 max-[800px]:text-center">
                                        Withdraw $EZSWAP. Transfer tokens from the staking contract to your wallet.
                                    </div>
                        }

                        {
                            activeButton === 0 ?
                                <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                    $EZSWAP Balance: {tokenBalance.toFixed(2)}
                                </div> :
                                activeButton === 1 ?
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Staked $EZSWAP Balance: {tokenStake.toFixed(2)}
                                    </div> :
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Available Balance:{tokenCanWithdraw.toFixed(2)}
                                    </div>
                        }

                        {activeButton !== 2 && <div className="flex mt-3">
                            <input className="border bg-black rounded-md px-2 w-[80%]" placeholder="Amount" type="number" min={0}
                                   value={inputAmount}
                                   onChange={(e) => changeAmount(e.target.value)}/>
                            <button className="ml-4 px-3 py-1 border border-[#00D5DA] rounded-md" onClick={() => maxOrHalf(0)}>Max</button>
                            <button className="ml-4 px-3 py-1 border border-[#00D5DA] rounded-md ml-5" onClick={() => maxOrHalf(1)}>Half</button>
                        </div>}
                        <div className="flex justify-center mt-10 mb-4">
                            <button onClick={() => confirm()} className="bg-[#00D5DA] text-black px-8 py-2 border rounded-md font-bold">{stakeLoading || approveLoading || waitApproveLoading2 || unStakingLoading || unStakingResultLoading || withdrawLoading || withdrawResultLoading ? <span className="loading loading-spinner loading-sm"></span> : activeButton === 0 ? 'Stake' : activeButton === 1 ? 'Unstake' : 'Withdraw'}</button>
                        </div>
                    </div>
                </div>
            </div>
            <AlertComponent ref={alertRef}/>
        </div>
    )
}

export default Staking

