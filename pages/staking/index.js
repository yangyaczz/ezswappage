import React, {useState, useEffect, useRef} from 'react'
import {useAccount, useContractRead, useContractWrite} from "wagmi";
import ERC20ABI from "../data/ABI/ERC20.json";
import AlertComponent from "../../components/common/AlertComponent";


const staking = () => {

    const [tokenStake, setTokenStake] = useState(0);
    const [tokenUnstaked, setTokenUnstaked] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [activeButton, setActiveButton] = useState(0);
    const [inputAmount, setInputAmount] = useState("");
    const alertRef = useRef(null);

    const {address: owner} = useAccount();

    const {data: tokenAmount1155, refetch: balanceOfRefetch} = useContractRead({
        address: '0x31753b319f03a7ca0264A1469dA0149982ed7564',
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [owner],
        watch: false,
        enabled: false,
        onSuccess(data) {
            console.log('balance: ', data)
            setTokenBalance(data)
        }
    })

    const {data: tokenAmount, refetch: balanceOfRefetch2} = useContractRead({
        address: '0x31753b319f03a7ca0264A1469dA0149982ed7564',
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [owner],
        watch: false,
        enabled: false,
        onSuccess(data) {
            console.log('setTokenStake: ', data)
            setTokenStake(data)
        }
    })

    const {data: tokenAmount3, refetch: balanceOfRefetch3} = useContractRead({
        address: '0x31753b319f03a7ca0264A1469dA0149982ed7564',
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [owner],
        watch: false,
        enabled: false,
        onSuccess(data) {
            console.log('setTokenUnstaked: ', data)
            setTokenUnstaked(data)
        }
    })

    const { data: mintNFTData, write: mintNFT, isLoading: mintNFTLoading } = useContractWrite({
        address: '0x31753b319f03a7ca0264A1469dA0149982ed7564',
        abi: ERC20ABI,
        functionName: 'mint',
        args: [],
        onError(error) {
            alertRef.current.showErrorAlert("error", error);
        }
    })

    useEffect(() => {

    })

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
        } else if (activeButton === 2) {
            if (step === 0) {
                setInputAmount(tokenUnstaked)
            } else {
                setInputAmount(tokenUnstaked / 2)
            }
        }

    }

    function changeAmount(amount) {
        setInputAmount(amount)
    }

    function confirm() {
        alertRef.current.showErrorAlert("error");
        if (activeButton === 0) {

        } else if (activeButton === 1) {

        } else if (activeButton === 2) {

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
                        <div>{tokenUnstaked}</div>
                    </div>
                </div>
                <div className="flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:justify-center  border rounded-3xl overflow-hidden min-[800px]:pl-4 min-[800px]:py-5 max-[800px]:py-2 w-[26%]  max-[800px]:w-[33%]">
                    <div>
                        <img className="w-[50px]" src="/wallet.svg" alt=""/>
                    </div>
                    <div className="min-[800px]:ml-4 max-[800px]:text-center">
                        <div className="font-bold">Balance</div>
                        <div>{tokenBalance}</div>
                    </div>
                </div>
            </div>
            <div className="border-t my-10 w-[55%] max-[800px]:w-[85%]"></div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 px-10 max-[800px]:px-3 w-[55%] mb-20 max-[800px]:w-[85%]">
                <div className="flex justify-center">
                    <ul className="menu menu-horizontal max-[800px]:p-0">
                        <li className={`border rounded-box min-[800px]:px-5 max-[800px]:py-2 font-bold ${activeButton === 0 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(0)}>STAKE</a></li>
                        <li className={`border rounded-box min-[800px]:px-5  max-[800px]:py-2 mx-10 max-[800px]:mx-3 font-bold ${activeButton === 1 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(1)}>UNSTAKE</a></li>
                        <li className={`border rounded-box min-[800px]:px-5 max-[800px]:py-2  font-bold ${activeButton === 2 && 'bg-[#00D5DA] text-black'}`}><a onClick={() => changeState(2)}>WITHDRAW</a></li>
                    </ul>
                </div>
                <div className="flex flex-col items-center justify-center max-[800px]:px-3">
                    <div className="block">
                        {
                            activeButton === 0 ?
                                <div className="my-10 max-[800px]:text-center">
                                    Staking tokens enables you to participate in EZSWAP governance, trading boost and future airdrop
                                </div> :
                                activeButton === 1 ?
                                    <div className="my-10 max-[800px]:text-center">
                                        Unstake tokens may lead to serious loss and will need a cool down period to withdraw your token
                                    </div> :
                                    <div className="my-10 max-[800px]:text-center">
                                        Unstake tokens may lead to serious loss and will need a cool down period to withdraw your token
                                    </div>
                        }

                        {
                            activeButton === 0 ?
                                <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                    $EZSWAP Balance:
                                </div> :
                                activeButton === 1 ?
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Staked $EZSWAP Balance:
                                    </div> :
                                    <div className="font-bold text-xl mt-10 max-[800px]:text-base">
                                        Available Balance:
                                    </div>
                        }

                        <div className="flex mt-3">
                            <input className="border bg-black rounded-md px-2 w-[80%]" placeholder="Amount" type="number" min={0}
                                   value={inputAmount}
                                   onChange={(e) => changeAmount(e.target.value)}/>
                            <button className="ml-4 px-3 py-1 border rounded-md" onClick={() => maxOrHalf(0)}>Max</button>
                            <button className="ml-4 px-3 py-1 border rounded-md ml-5" onClick={() => maxOrHalf(1)}>Half</button>
                        </div>
                        <div className="flex justify-center mt-10 mb-4">
                            <button onClick={() => confirm()} className="bg-[#00D5DA] text-white px-6 py-2 border rounded-md">{activeButton === 0 ? 'Stake' : activeButton === 1 ? 'Unstake' : 'Withdraw'}</button>
                        </div>
                    </div>
                </div>
            </div>
            <AlertComponent ref={alertRef} />
        </div>
    )
}

export default staking
