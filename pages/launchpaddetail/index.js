import React, {useState, useEffect, useRef} from 'react'
import addressIcon from "@/pages/data/address_icon";
import {useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import ERC20ABI from "../data/ABI/ERC20.json";
import SeaDrop721 from "../data/ABI/SeaDrop.json";
import SeaDrop1155 from "../data/ABI/SeaDrop1155.json";
import networkConfig from "../../pages/data/networkconfig.json";
import AlertComponent from "../../components/common/AlertComponent";
import {isNaN} from "formik";
import {ethers} from "ethers";
import styles from "../../components/swap/swapUtils/index.module.scss";

const LaunchpadDetail = () => {

    const [launchpadDetail, setLaunchpadDetail] = useState({});
    const [freeWhiteList, setFreeWhiteList] = useState({});
    const [privateWhiteList, setPrivateWhiteList] = useState({});
    const [whiteMintCount, setWhiteMintCount] = useState(0);
    const [privateMintCount, setPrivateMintCount] = useState(0);
    const [publicMintCount, setPublicMintCount] = useState(0);
    const [mintNumber, setMintNumber] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalMinted, stTotalMinted] = useState(0);
    const {address: owner} = useAccount();
    const {chain} = useNetwork();
    const [inputMax, setInputMax] = useState(0);

    const alertRef = useRef(null);
    const [mintLoading, setMintLoading] = useState(false);

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        currentStep()
    })

    async function initData() {
        await queryLaunchpadDetail()
        if (launchpadDetail.haveWhiteMint === 1) {
            await queryWhiteList(0)
            // queryFreeMintInfoRefetch()
        }
        if (launchpadDetail.havePrivateMint === 1) {
            await queryWhiteList(1)
            // queryPrivateInfoRefetch()
        }
        // queryPublicMintInfoRefetch()
    }

    // 查询freemint总计的数量信息
    const {refetch: queryFreeMintInfoRefetch} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        functionName: 'getWhiteList',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            console.log('getWhiteList: ', data)
            setWhiteMintCount(parseInt(data[1]))
            // setTotalSupply(parseInt(data.maxSupply))
            // stTotalMinted(parseInt(data.totalMinted))
        },
        onError(err) {
            console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        },
    })

    // 查询private总计的数量信息
    const {refetch: queryPrivateInfoRefetch} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        functionName: 'getPrivateDrop',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            console.log('getPrivateDrop: ', data)
            setPrivateMintCount(parseInt(data[2]))
            // setTotalSupply(parseInt(data.maxSupply))
            // stTotalMinted(parseInt(data.totalMinted))
        },
        onError(err) {
            console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        },
    })

    // 查询总计的数量信息
    const {refetch: queryPublicMintInfoRefetch} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        functionName: 'getPublicDrop',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            console.log('getPublicDrop: ', data)
            setPublicMintCount(parseInt(data[2]))
            // setTotalSupply(parseInt(data.maxSupply))
            // stTotalMinted(parseInt(data.totalMinted))
        },
        onError(err) {
            console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        },
    })

    // 查询每个阶段的数量信息
    const {refetch: queryEveryStepMinted} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        functionName: 'getMintStats',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            console.log('getMintStats: ', data)
            setTotalSupply(parseInt(data.maxSupply))
            stTotalMinted(parseInt(data.totalMinted))
        },
        onError(err) {
            console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        },
    })

    async function queryLaunchpadDetail() {
        const params = {id: 217};
        const response = await fetch("/api/queryLaunchpadDetail", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
        });
        const data = await response.json();
        if (data.success) {
            await setLaunchpadDetail(data.data)
            // queryFreeMintInfoRefetch()
            // await queryInfoRefetch()
        }

    }

    async function queryWhiteList(step) {
        const params = {
            "launchpadId": "217",
            "walletAddress": owner,
            "launchpadStep": 0
        };
        const response = await fetch("/api/queryLaunchpadDetail", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
        });
        const data = await response.json();
        if (data.success && data.data) {
            if (step === 0) {
                setFreeWhiteList(data.data)
            } else {
                setPrivateWhiteList(data.data)
            }
            // setLaunchpadDetail(data.data)
        }
    }

    function stepStatus(startTime, endTime) {
        const currentTime = Math.round(new Date().getTime() / 1000)
        // console.log(currentTime)
        if (currentTime < startTime) {
            return "Coming Soon"
        } else if (currentTime > startTime && currentTime < endTime) {
            return "End at " + formatTimestamp(endTime)
        } else if (currentTime > endTime) {
            return "End"
        }
    }

    function currentStep() {
        console.log('currentStep')
        const currentTime = Math.round(new Date().getTime() / 1000)
        if (launchpadDetail.haveWhiteMint === 1 && currentTime > launchpadDetail.whiteMintStartTime && currentTime < launchpadDetail.whiteMintEndTime) {
            // 白单阶段打开了,并且有白单名额
            if (freeWhiteList.signature !== null && freeWhiteList.signature !== undefined) {
                setInputMax(launchpadDetail.whiteMintEveryUserMintLimit)
                return 0
            } else if (currentTime > launchpadDetail.publicStartTime && currentTime < launchpadDetail.publicEndTime) {
                setInputMax(launchpadDetail.publicEveryUserMintLimit)
                return 2
            } else {
                setInputMax(launchpadDetail.whiteMintEveryUserMintLimit)
                return 0
            }
            // todo 还得考虑白单名额有没有用完
        }
        if (launchpadDetail.havePrivateMint === 1 && currentTime > launchpadDetail.privateStartTime && currentTime < launchpadDetail.privateEndTime) {
            // 白单阶段打开了,并且有白单名额
            // todo 还得考虑白单名额有没有用完
            if (privateWhiteList.signature !== null && privateWhiteList.signature !== undefined) {
                setInputMax(launchpadDetail.privateEveryUserMintLimit)
                return 1
            } else if (currentTime > launchpadDetail.publicStartTime && currentTime < launchpadDetail.publicEndTime) {
                setInputMax(launchpadDetail.publicEveryUserMintLimit)
                return 2
            } else {
                setInputMax(launchpadDetail.privateEveryUserMintLimit)
                return 1
            }
        }
        setInputMax(launchpadDetail.publicEveryUserMintLimit)
        return 2

        // console.log(currentTime)
        // if (currentTime < startTime) {
        //     return "Coming Soon"
        // } else if (currentTime > startTime && currentTime < endTime) {
        //     return "End at " + formatTimestamp(endTime)
        // } else if (currentTime > endTime) {
        //     return "End"
        // }
    }


    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        const hours = ('0' + date.getHours()).slice(-2)
        const minutes = ('0' + date.getMinutes()).slice(-2)
        return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    function mintNFT() {
        console.log('parseInt(launchpadDetail.network, 16)', parseInt(launchpadDetail.network, 16), chain.id)
        if (chain.id !== parseInt(launchpadDetail.network, 16)) {
            alertRef.current.showErrorAlert("Please switch to right chain");
            return;
        }
        // todo 每个钱包的上限限制
        console.log('fadfafa')
        if (currentStep === 0) {
            freeMintDataFunction()
        } else if (currentStep === 1) {
            privateMintDataFunction()
        } else {
            publicMintDataFunction()
        }
    }

    const {
        data: freeMintData, isLoading: approveLoading, isSuccess: approveSuccess, write: freeMintDataFunction, status: approveStatus, error: approveError,
    } = useContractWrite({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: launchpadDetail.erc === '721' ? SeaDrop721 : SeaDrop1155,
        functionName: "whiteListMint",
        args: launchpadDetail.erc === '721' ? [launchpadDetail.contractAddress, owner, mintNumber, freeWhiteList.signature] : [launchpadDetail.contractAddress, owner, launchpadDetail.currentTokenId, mintNumber, freeWhiteList.signature],
        onError(err) {
            console.log('free mint 失败,', err)
            alertRef.current.showErrorAlert("Free Mint fail");
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('free mint 失败', error)
            if (error) {
                alertRef.current.showErrorAlert("Free Mint Fail");
                setMintLoading(false)
            }
        }
    });
    const {
        waitApproveData2,
        waitApproveIsError2,
        isLoading: waitApproveLoading2,
    } = useWaitForTransaction({
        hash: freeMintData?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Free Mint Success");
            setMintLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Free Mint Fail");
            setMintLoading(false)
        },
    });

    const {
        data: privateMintData, isLoading: privateLoading, isSuccess: privateSuccess, write: privateMintDataFunction, status: privateStatus, error: privateError,
    } = useContractWrite({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: launchpadDetail.erc === '721' ? SeaDrop721 : SeaDrop1155,
        functionName: "mintPrivate",
        args: launchpadDetail.erc === '721' ? [launchpadDetail.contractAddress, owner, mintNumber, privateWhiteList.signature] : [launchpadDetail.contractAddress, owner, launchpadDetail.currentTokenId, mintNumber, privateWhiteList.signature],
        value: mintNumber && launchpadDetail.publicFee ? ethers.utils.parseEther((Math.floor(mintNumber * launchpadDetail.privateFee * 1000000000000000000) / 1000000000000000000).toString()) : 0,
        onError(err) {
            console.log('private mint 失败,', err)
            alertRef.current.showErrorAlert("Private Mint fail");
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('free mint 失败', error)
            if (error) {
                alertRef.current.showErrorAlert("Private Mint Fail");
                setMintLoading(false)
            }
        }
    });
    const {
        isLoading: waitPrivateLoading,
    } = useWaitForTransaction({
        hash: privateMintData?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Private Mint Success");
            setMintLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Private Mint Fail");
            setMintLoading(false)
        },
    });

    const {
        data: publicMintData, isLoading: publicLoading, isSuccess: publicSuccess, write: publicMintDataFunction, status: publicStatus, error: publicError,
    } = useContractWrite({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: launchpadDetail.erc === '721' ? SeaDrop721 : SeaDrop1155,
        functionName: "mintPublic",
        args: launchpadDetail.erc === '721' ? [launchpadDetail.contractAddress, owner, mintNumber] : [launchpadDetail.contractAddress, owner, launchpadDetail.currentTokenId, mintNumber],
        value: mintNumber && launchpadDetail.publicFee ? ethers.utils.parseEther((Math.floor(mintNumber * launchpadDetail.publicFee * 1000000000000000000) / 1000000000000000000).toString()) : 0,
        onError(err) {
            console.log('public mint 失败,', err)
            alertRef.current.showErrorAlert("Public Mint fail");
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('public mint 失败', error)
            if (error) {
                alertRef.current.showErrorAlert("Public Mint Fail");
                setMintLoading(false)
            }
        }
    });
    const {
        isLoading: waitPublicLoading,
    } = useWaitForTransaction({
        hash: publicMintData?.hash,
        confirmations: 1,
        onSuccess(data) {
            alertRef.current.showSuccessAlert("Public Mint Success");
            setMintLoading(false)
        },
        onError(err) {
            alertRef.current.showErrorAlert("Public Mint Fail");
            setMintLoading(false)
        },
    });

    const handleChange = (e) => {
        const inputValue = e.target.value;

        // check
        if (/^\d+$/.test(inputValue)) {
            setMintNumber(Math.min(Math.max(0, Number(inputValue)), inputMax));
        } else {
            setMintNumber(0);
        }
    };


    const handleIncrement = () => {
        setMintNumber(prev => Math.min(prev + 1, inputMax))
    };

    const handleDecrement = () => {
        setMintNumber(prev => Math.max(prev - 1, 0))
    };


    return (
        <div className="mt-20 text-white">
            <div className="flex justify-center">
                <div className="mr-16">
                    <img className="rounded-2xl w-[400px] border" src={launchpadDetail.imgUrl} alt=""/>
                </div>
                {/*右边*/}
                <div className="w-[40%]">
                    <div className="text-4xl text-bold mb-4">{launchpadDetail.collectionName}</div>
                    <div className="flex items-center  mb-4">
                        {/*<img src="/game/IMG_9873.PNG" className="rounded-full w-[40px]" alt=""/>*/}
                        <span className="mr-4">@{launchpadDetail?.userAccount?.userName}</span>
                        <a href=""><img src="/website.svg" alt=""/></a>
                        <a className="ml-4" href=""><img src="/Twitter.svg" alt=""/></a>
                    </div>
                    <div className="relative">
                        {/*进度条*/}
                        <div className="flex justify-center absolute z-10 w-full mt-1">{totalMinted}/{totalSupply >= 999999999 ? "∞" : totalSupply}</div>
                        <progress className="progress progress-success mb-4 h-[30px] border" value={totalMinted} max={totalSupply}></progress>
                    </div>
                    <div>
                        {launchpadDetail.description}
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="flex justify-center items-center">
                        <div className='form-control'>
                            <div className="input-group">
                                <button
                                    onClick={handleDecrement}
                                    className="btn btn-square border border-1 border-white hover:border-white"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={mintNumber}
                                    onChange={handleChange}
                                    className={"w-20 text-center input input-bordered bg-black " + styles.inputContent}
                                />
                                <button
                                    onClick={handleIncrement}
                                    className="btn btn-square border border-1 border-white hover:border-white"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {/*    mint按钮*/}
                        <span className="flex items-center ml-4">
                                    <img className="w-[13px] h-[13px] mr-1" src={addressIcon[launchpadDetail.network] && addressIcon[launchpadDetail.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>
                                    <span>{currentStep === 0 ? "Free Mint" : currentStep === 1 ? (launchpadDetail.privateFee === 0 || launchpadDetail.privateFee === null ? 'Free Mint':launchpadDetail.privateFee / 1e18) : (launchpadDetail.publicFee === 0  || launchpadDetail.publicFee===null? 'Free Mint':launchpadDetail.publicFee / 1e18)}</span>
                                </span>
                        </div>
                        <button className="bg-[#00D5DA] text-black rounded-xl px-6 py-1 mt-2" onClick={() => mintNFT(0)}>{mintLoading || privateLoading || waitPrivateLoading || publicLoading || waitPublicLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Mint'}</button>
                    </div>
                </div>
            </div>
            {/*时间轴*/}
            <div className="flex justify-center">
                <div className="mt-10 mb-10 block w-[80%]">
                    <ul className="timeline justify-center">
                        {launchpadDetail.haveWhiteMint === 1 && <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>white list</div>
                                <div>{whiteMintCount}/{launchpadDetail.whiteMintSupply > 999999999 ? "∞" : launchpadDetail.whiteMintSupply}</div>
                                <div>{stepStatus(launchpadDetail.whiteMintStartTime, launchpadDetail.whiteMintEndTime)}</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>}
                        {launchpadDetail.havePrivateMint === 1 && <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>private list</div>
                                <div>{privateMintCount}/{launchpadDetail.privateSupply > 999999999 ? "∞" : launchpadDetail.privateSupply}</div>
                                <div>{stepStatus(launchpadDetail.privateStartTime, launchpadDetail.privateEndTime)}</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>}
                        <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>public list</div>
                                <div>{publicMintCount}/{launchpadDetail.publicSupply > 999999999 ? "∞" : launchpadDetail.publicSupply}</div>
                                <div>{stepStatus(launchpadDetail.publicStartTime, launchpadDetail.publicEndTime)}</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>
                    </ul>
                </div>
            </div>
            <AlertComponent ref={alertRef}/>
        </div>
    )
}

export default LaunchpadDetail
