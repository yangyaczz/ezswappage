import React, {useState, useEffect, useRef} from 'react'
import {useAccount, useContractRead, useContractWrite, useWaitForTransaction} from "wagmi";
import ERC20ABI from "../data/ABI/ERC20.json";
import stakeAbi from "../data/ABI/stakeabi.json";
import AlertComponent from "../../components/common/AlertComponent";
import ERC721EnumABI from "../data/ABI/ERC721Enum.json";
import networkConfig from "../data/networkconfig.json";


const Staking = () => {

    const [tokenStake, setTokenStake] = useState(0);
    const [tokenUnstaked, setTokenUnstaked] = useState(0);
    const [tokenCanWithdraw, setTokenCanWithdraw] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [activeButton, setActiveButton] = useState(0);
    const [inputAmount, setInputAmount] = useState("");
    const alertRef = useRef(null);
    const [stakeLoading, setStakeLoading] = useState(false);
    const [tokenApproval, setTokenApproval] = useState(0);

    const {address: owner} = useAccount();

    const {data: tokenAmount1155, refetch: balanceOfRefetch} = useContractRead({
        address: '0xB32eFC47Bf503B3593a23204cF891295a85115Ea',
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
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'stakes',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('setTokenStake: ', data)
            setTokenStake(parseInt(data)/1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })
    const {data: tokenAmount2, refetch: balanceOfRefetch3} = useContractRead({
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'getTotalUnstakedAmount',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('getTotalUnstakedAmount: ', data)
            setTokenUnstaked(parseInt(data)/1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: tokenAmount4, refetch: balanceOfRefetch4} = useContractRead({
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'getAvailableWithdrawAmount',
        args: [owner],
        watch: true,
        onSuccess(data) {
            console.log('getTotalUnstakedAmount: ', data)
            setTokenCanWithdraw(parseInt(data)/1e18)
        },
        onError(err) {
            console.log("查询失败:", err);
        },
    })

    const {data: nftApprovalData} = useContractRead({
        address: "0xB32eFC47Bf503B3593a23204cF891295a85115Ea",
        abi: ERC20ABI,
        functionName: "allowance",
        args: [owner, "0x5Ac527E475DE83665D224809FC193921482aB48c"],
        watch: true,
        onSuccess(data) {
            console.log('授权结果', data)
            setTokenApproval(parseInt(data))
        },
    });

    const {
        data: approveNFTData, isLoading: approveLoading, isSuccess: approveSuccess, write: approveTokenFunction, status: approveStatus, error: approveError,
    } = useContractWrite({
        address: '0xB32eFC47Bf503B3593a23204cF891295a85115Ea',
        abi: ERC20ABI,
        functionName: "approve",
        args: ["0x5Ac527E475DE83665D224809FC193921482aB48c", 1e18 * 1e18],
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
            setStakeLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Approve Fail");
            setStakeLoading(false)
        },
    });

    const {data: stakeResult, write: stakeToken, isLoading: mintNFTLoading} = useContractWrite({
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'stake',
        args: [(inputAmount * 1e18).toLocaleString().replaceAll(',', '')],
        onError(error) {
            alertRef.current.showErrorAlert("error", error);
            setStakeLoading(false)
        }
    })

    const {data: unStakeResult, write: unStakeTokenFunction, isLoading: unStakingLoading} = useContractWrite({
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'unstake',
        args: [(inputAmount * 1e18).toLocaleString().replaceAll(',', '')],
        onError(error) {
            alertRef.current.showErrorAlert("error", error);
            setStakeLoading(false)
        }
    })

    const {data: withdrawResult, write: withdrawTokenFunction, isLoading: withdrawLoading} = useContractWrite({
        address: '0x5Ac527E475DE83665D224809FC193921482aB48c',
        abi: stakeAbi,
        functionName: 'withdraw',
        args: [],
        onError(error) {
            console.log('withdraw 错误', error.message)
            let errorMsg = "error: ";
            if (error.message.indexOf("No available amount to withdraw") > -1) {
                errorMsg += "No available amount to withdraw";
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
        setInputAmount(amount)
    }

    function confirm() {
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
                        <div>{tokenStake}</div>
                    </div>
                </div>
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center  border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%] max-[800px]:mx-3 max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/unstaking.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Unstaked</div>
                        {/*<div>{tokenUnstaked}</div>*/}
                        <div>{tokenCanWithdraw}</div>
                    </div>
                </div>
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center  border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%]  max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/locked.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Locked</div>
                        <div>{tokenStake-tokenCanWithdraw}</div>
                    </div>
                </div>
            </div>
            <div className="border-t my-10 w-[50%] max-[800px]:w-[85%] border-[#00D5DA]"></div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 px-10 max-[800px]:px-3 w-[55%] mb-20 max-[800px]:w-[85%]">
                <div className="flex justify-center">
                    <ul className="menu menu-horizontal max-[800px]:p-0">
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5 max-[800px]:py-2 font-bold ${activeButton === 0 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(0)}>STAKE</a></li>
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5  max-[800px]:py-2 mx-10 max-[800px]:mx-3 font-bold ${activeButton === 1 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(1)}>UNSTAKE</a></li>
                        <li className={`border border-[#00D5DA] rounded-box min-[800px]:px-5 max-[800px]:py-2  font-bold ${activeButton === 2 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(2)}>WITHDRAW</a></li>
                    </ul>
                </div>
                <div className="flex flex-col items-center justify-center max-[800px]:px-3">
                    <div className="block">
                        {
                            activeButton === 0 ?
                                <div className="my-10 max-[800px]:text-center">
                                    Staking $EZswap enables you to participate in future airdrop and launchpad. Newly-staked tokens become eligible at the beginning of the next epoch.
                                </div> :
                                activeButton === 1 ?
                                    <div className="my-10 max-[800px]:text-center">
                                        Unstaking $EZswap enables you to withdraw them from the staking contract after a cooldown period of one epoch once the current epoch ends.
                                    </div> :
                                    <div className="my-10 max-[800px]:text-center">
                                        Withdraw $EZswap. Transfer tokens from the staking contract to your wallet.
                                    </div>
                        }

                        {
                            activeButton === 0 ?
                                <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                    $EZSWAP Balance: {tokenBalance}
                                </div> :
                                activeButton === 1 ?
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Staked $EZSWAP Balance: {tokenStake}
                                    </div> :
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Available Balance:{tokenCanWithdraw}
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

