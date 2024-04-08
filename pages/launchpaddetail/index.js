import React, {useState, useEffect, useRef} from 'react'
import addressIcon from "@/pages/data/address_icon";
import {useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import SeaDrop721 from "../data/ABI/SeaDrop.json";
import SeaDrop1155 from "../data/ABI/SeaDrop1155.json";
import networkConfig from "../../pages/data/networkconfig.json";
import AlertComponent from "../../components/common/AlertComponent";
import {useRouter} from "next/router";

const LaunchpadDetail = () => {

    const router = useRouter();
    const [launchpadDetail, setLaunchpadDetail] = useState({});
    const [freeWhiteList, setFreeWhiteList] = useState({});
    const [privateWhiteList, setPrivateWhiteList] = useState({});
    const [whiteMintCount, setWhiteMintCount] = useState(0);
    const [privateMintCount, setPrivateMintCount] = useState(0);
    const [publicMintCount, setPublicMintCount] = useState(0);
    const [mintNumber, setMintNumber] = useState(1);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalMinted, stTotalMinted] = useState(0);
    const {address: owner} = useAccount();
    const {chain} = useNetwork();
    const [inputMax, setInputMax] = useState(0);
    const [currentStepStatus, setCurrentStepStatus] = useState(0);
    const [userMintedCount, setUserMintedCount] = useState(0);

    const alertRef = useRef(null);
    const [mintLoading, setMintLoading] = useState(false);

    // useEffect(() => {
    //
    // }, [])

    // useEffect(() => {
    //     currentStep()
    // })

    async function initData(id) {
        await queryLaunchpadDetail(id)
        // queryPublicMintInfoRefetch()
    }

    useEffect(() => {
        const id = router.query.id;
        console.log('id', id)
        if (null !== id && undefined !== id){
            initData(id)
        }
        // 这里你可以使用获取到的id值进行一些操作
    }, [router.query.id]);

    // 查询用户mint的数量
    const {data: queryUserMintedCount, refetch: queryUserMintedRefetch} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        chainId: parseInt(launchpadDetail?.network, 16),
        functionName: 'walletMintedByStage',
        args: [launchpadDetail.contractAddress, 0, owner],
        watch: false,
        enabled: false
        // onSuccess(data) {
        //     console.log('parseInt(data)', parseInt(data))
        //     setUserMintedCount(parseInt(data))
        // },
        // onError(err) {
        //     console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        // },
    })

    // 查询freemint总计的数量信息
    const {refetch: queryFreeMintInfoRefetch} = useContractRead({
        address: launchpadDetail.erc === '721' ? networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory : networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpad1155Factory,
        abi: SeaDrop721,
        chainId: parseInt(launchpadDetail?.network, 16),
        functionName: 'getWhiteList',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            // console.log('getWhiteList: ', data)
            if (launchpadDetail. collectionName=== 'Mantera'){
                setWhiteMintCount(2000)
            }else {
                setWhiteMintCount(parseInt(data[1]))
            }
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
        chainId: parseInt(launchpadDetail?.network, 16),
        functionName: 'getPrivateDrop',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            // console.log('getPrivateDrop: ', data)
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
        chainId: parseInt(launchpadDetail?.network, 16),
        functionName: 'getPublicDrop',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            // console.log('getPublicDrop: ', data)
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
        chainId: parseInt(launchpadDetail?.network, 16),
        functionName: 'getMintStats',
        args: [launchpadDetail.contractAddress],
        watch: true,
        // enabled: false,
        onSuccess(data) {
            // console.log('getMintStats: ', data)
            setTotalSupply(parseInt(data.maxSupply))
            if (launchpadDetail. collectionName=== 'Mantera'){
                stTotalMinted(1000)
            }else {
                stTotalMinted(parseInt(data.totalMinted))
            }
        },
        onError(err) {
            console.log("nft mint信息查询失败:", launchpadDetail.contractAddress, networkConfig[parseInt(launchpadDetail?.network, 16)]?.launchpadFactory, err);
        },
    })

    async function queryLaunchpadDetail(id) {
        const params = {id: id};
        const response = await fetch("/api/queryLaunchpadDetail", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
        });
        const data = await response.json();
        if (data.success) {
            await setLaunchpadDetail(data.data)
            currentStep(data.data)
            // if (data.data.haveWhiteMint === 1) {
            //     await queryWhiteList(0, data.data)
            // queryFreeMintInfoRefetch()
            // }
            // if (data.data.havePrivateMint === 1) {
            //     await queryWhiteList(1, data.data)
            // queryPrivateInfoRefetch()
            // }
            // queryFreeMintInfoRefetch()
            // await queryInfoRefetch()
        }

    }

    async function queryWhiteList(step, _launchpadDetail) {
        const params = {
            "launchpadId": _launchpadDetail.id,
            "walletAddress": owner,
            "launchpadStep": step
        };
        const response = await fetch("/api/queryLaunchpadWhiteList", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
        });
        return await response.json();

    }

    function stepStatus(startTime, endTime) {
        const currentTime = Math.round(new Date().getTime() / 1000)
        // console.log(currentTime)
        if (currentTime < startTime) {
            return "Start at " + formatTimestamp(startTime)
        } else if (currentTime > startTime && currentTime < endTime) {
            return "" + formatTimestamp(endTime)
        } else if (currentTime > endTime) {
            return "End at " + formatTimestamp(endTime)
        }
    }

    function mintButtonStatus(startTime, endTime) {
        const currentTime = Math.round(new Date().getTime() / 1000)
        // console.log(currentTime)
        if (currentTime < startTime) {
            return "Coming Soon"
        } else if (currentTime > startTime && currentTime < endTime) {
            return "Mint"
        } else if (currentTime > endTime) {
            if (currentTime < launchpadDetail.privateStartTime || currentTime < launchpadDetail.publicStartTime ){
                return "Coming Soon"
            }else {
                return "End"
            }
        }
    }


    function checkMintButtonStatus() {
        if (currentStepStatus===0){
         return mintButtonStatus(launchpadDetail.whiteMintStartTime, launchpadDetail.whiteMintEndTime)
        }else if (currentStepStatus===1){
            return mintButtonStatus(launchpadDetail.privateStartTime, launchpadDetail.privateEndTime)
        }else if (currentStepStatus===2){
            return mintButtonStatus(launchpadDetail.publicStartTime, launchpadDetail.publicEndTime)
        }
    }



    async function currentStep(_launchpadDetail) {
        if (_launchpadDetail === null || _launchpadDetail === undefined) {
            _launchpadDetail = launchpadDetail
        }
        // if (_freeWhiteList === null || _freeWhiteList === undefined){
        //     _freeWhiteList = freeWhiteList
        // }
        // if (_privateWhiteList === null || _privateWhiteList === undefined){
        //     _privateWhiteList = privateWhiteList
        // }

        const currentTime = Math.round(new Date().getTime() / 1000)
        if (_launchpadDetail.haveWhiteMint === 1 && currentTime > _launchpadDetail.whiteMintStartTime && currentTime < _launchpadDetail.whiteMintEndTime) {
            // 白单阶段打开了,并且有白单名额
            const _freeWhiteList = await queryWhiteList(0, _launchpadDetail)
            if (_freeWhiteList.success && _freeWhiteList.data) {
                setFreeWhiteList(_freeWhiteList.data)
            }
            if (_freeWhiteList?.data?.signature !== null && _freeWhiteList?.data?.signature !== undefined) {
                const queryUserMintedCount = await queryUserMintedRefetch()
                console.log('queryUserMintedCount,', queryUserMintedCount.data)
                if (parseInt(queryUserMintedCount.data) >= _launchpadDetail.whiteMintEveryUserMintLimit) {
                    setInputMax(_launchpadDetail.publicEveryUserMintLimit)
                    return setCurrentStepStatus(2)
                } else {
                    setInputMax(_launchpadDetail.whiteMintEveryUserMintLimit)
                    return setCurrentStepStatus(0)
                }
            } else if (_launchpadDetail.havePublicMint === 1 && currentTime > _launchpadDetail.publicStartTime && currentTime < _launchpadDetail.publicEndTime) {
                setInputMax(_launchpadDetail.publicEveryUserMintLimit)
                return setCurrentStepStatus(2)
            } else {
                setInputMax(_launchpadDetail.whiteMintEveryUserMintLimit)
                return setCurrentStepStatus(0)
            }
            // todo 还得考虑白单名额有没有用完
        }
        if (_launchpadDetail.havePrivateMint === 1 && currentTime > _launchpadDetail.privateStartTime && currentTime < _launchpadDetail.privateEndTime) {
            // 白单阶段打开了,并且有白单名额
            // todo 还得考虑白单名额有没有用完
            const _privateWhiteList = await queryWhiteList(1, _launchpadDetail)
            console.log('_privateWhiteList', _privateWhiteList)
            if (_privateWhiteList.success && _privateWhiteList.data) {
                setPrivateWhiteList(_privateWhiteList.data)
            }
            if (_privateWhiteList?.data?.signature !== null && _privateWhiteList?.data?.signature !== undefined) {
                setInputMax(_launchpadDetail.privateEveryUserMintLimit)
                return setCurrentStepStatus(1)
            } else if (_launchpadDetail.havePublicMint === 1 && currentTime > _launchpadDetail.publicStartTime && currentTime < _launchpadDetail.publicEndTime) {
                setInputMax(_launchpadDetail.publicEveryUserMintLimit)
                return setCurrentStepStatus(2)
            } else {
                setInputMax(_launchpadDetail.privateEveryUserMintLimit)
                return setCurrentStepStatus(1)
            }
        }
        console.log('launchpadDetail', _launchpadDetail)
        setInputMax(_launchpadDetail.publicEveryUserMintLimit)
        return setCurrentStepStatus(2)

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
        if (mintNumber < 1) {
            alertRef.current.showErrorAlert("Please input mint number");
            return;
        }
        // console.log('parseInt(launchpadDetail.network, 16)', parseInt(launchpadDetail.network, 16), chain.id)
        if (chain.id !== parseInt(launchpadDetail.network, 16)) {
            alertRef.current.showErrorAlert(`Please switch to ${networkConfig[parseInt(launchpadDetail?.network, 16)].networkName} chain`);
            return;
        }
        // todo 每个钱包的上限限制
        // console.log('fadfafa')
        setMintLoading(true)
        if (currentStepStatus === 0) {
            if (freeWhiteList.signature === undefined){
                alertRef.current.showErrorAlert(`MinterNotWhitelist`);
                setMintLoading(false)
                return;
            }
            freeMintDataFunction()
        } else if (currentStepStatus === 1) {
            if (privateWhiteList.signature === undefined){
                alertRef.current.showErrorAlert(`MinterNotWhitelist`);
                setMintLoading(false)
                return;
            }
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
            console.log('Whitelist mint 失败,', err)
            let errorMsg = "Whitelist Mint Fail ";
            if (err.message.indexOf("MinterNotWhitelist") > -1) {
                errorMsg += "MinterNotWhitelist";
            } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
            } else if (err.message.indexOf("nvalid signature") > -1) {
                errorMsg += "invalid signature";
            } else if (err.message.indexOf("NotActive") > -1) {
                errorMsg += "NotActive";
            }
            alertRef.current.showErrorAlert(errorMsg);
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('free mint 失败', error)
            if (error) {
                let errorMsg = "Free Mint Fail ";
                if (err.message.indexOf("MinterNotWhitelist") > -1) {
                    errorMsg += "MinterNotWhitelist";
                } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                    errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
                } else if (err.message.indexOf("nvalid signature") > -1) {
                    errorMsg += "invalid signature";
                } else if (err.message.indexOf("NotActive") > -1) {
                    errorMsg += "NotActive";
                }
                alertRef.current.showErrorAlert(errorMsg);
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
        value: mintNumber && launchpadDetail.privatePrice ? (((mintNumber * launchpadDetail.privatePrice + parseInt(launchpadDetail.privateFee || 0)) * 1e18) / 1e18).toString() : 0,
        onError(err) {
            console.log('Partnership mint 失败,', err)
            let errorMsg = "Partnership Mint Fail ";
            if (err.message.indexOf("MinterNotWhitelist") > -1) {
                errorMsg += "MinterNotWhitelist";
            } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
            } else if (err.message.indexOf("nvalid signature") > -1) {
                errorMsg += "invalid signature";
            } else if (err.message.indexOf("NotActive") > -1) {
                errorMsg += "NotActive";
            }
            alertRef.current.showErrorAlert(errorMsg);
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('free mint 失败', error)
            if (error) {
                let errorMsg = "Private Mint Fail ";
                if (err.message.indexOf("MinterNotWhitelist") > -1) {
                    errorMsg += "MinterNotWhitelist";
                } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                    errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
                } else if (err.message.indexOf("nvalid signature") > -1) {
                    errorMsg += "invalid signature";
                } else if (err.message.indexOf("NotActive") > -1) {
                    errorMsg += "NotActive";
                }
                alertRef.current.showErrorAlert(errorMsg);
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
        value: mintNumber && launchpadDetail.publicPrice ? (((mintNumber * launchpadDetail.publicPrice + parseInt(launchpadDetail.privateFee || 0)) * 1e18) / 1e18).toString() : 0,
        onError(err) {
            console.log('public mint 失败,', err)
            let errorMsg = "Public Mint fail ";
            if (err.message.indexOf("NotActive") > -1) {
                errorMsg += "NotActive";
            } else if (err.message.indexOf("of executing this transaction exceeds the balance of the") > -1) {
                errorMsg += "don't have enough balance";
            } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
            }
            alertRef.current.showErrorAlert(errorMsg);
            setMintLoading(false)
        },
        onSettled(data, error) {
            console.log('public mint 失败', error)
            if (error) {
                let errorMsg = "Public Mint Fail ";
                if (err.message.indexOf("NotActive") > -1) {
                    errorMsg += "NotActive";
                } else if (err.message.indexOf("of executing this transaction exceeds the balance of the") > -1) {
                    errorMsg += "don't have enough balance";
                } else if (err.message.indexOf("MintQuantityExceedsMaxMintedPerWallet") > -1) {
                    errorMsg += "MintQuantityExceedsMaxMintedPerWallet";
                }
                alertRef.current.showErrorAlert(errorMsg);
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
        setMintNumber(prev => Math.max(prev - 1, 1))
    };


    return (
        <div className="min-[800px]:mt-20 max-[800px]:mt-10 text-white">
            <div className="flex justify-center max-[800px]:flex-col max-[800px]:items-center">
                <div className="min-[800px]:mr-16 max-[800px]:px-10">
                    <img className="rounded-2xl min-[800px]:w-[400px]" src={launchpadDetail.imgUrl} alt=""/>
                </div>
                {/*右边*/}
                <div className="min-[800px]:w-[40%] max-[800px]:mt-10  max-[800px]:items-start max-[800px]:mx-10">
                    <div className="text-4xl font-bold mb-4 flex items-center max-[800px]:text-4xl">
                        {launchpadDetail.collectionName}
                        {(launchpadDetail.website !== null && launchpadDetail.website !== '') && <a className='ml-4 mt-1' href={launchpadDetail.website}><img src="/website.svg" alt=""/></a>}
                        <a className="ml-4 mt-1" href={launchpadDetail.twitter}><img src="/Twitter.svg" alt=""/></a>
                    </div>
                    <div className="flex items-center  mb-4">
                        {/*<img src="/game/IMG_9873.PNG" className="rounded-full w-[40px]" alt=""/>*/}
                        {/*<span className="mr-4 font-bold">@{launchpadDetail?.userAccount?.userName} </span>*/}

                    </div>
                    <div className="relative">
                        {/*进度条*/}
                        <div className="flex justify-center absolute z-10 w-full mt-1">{totalMinted}/{totalSupply >= 999999999 ? "∞" : totalSupply}</div>
                        <progress className="progress progress-success mb-4 h-[30px]" value={totalMinted} max={totalSupply}></progress>
                    </div>
                    <div>
                        {launchpadDetail.description}
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="flex justify-center items-center">
                            <div className='form-control'>
                                <div className="input-group">
                                    <button onClick={handleDecrement} className="rounded-l-xl btn-square border border-white max-[800px]:w-7 bg-black max-[800px]:h-[30px]">-</button>
                                    <input type="text" value={mintNumber} onChange={handleChange}
                                        className="w-14 max-[800px]:w-10 text-center border-y rounded-none py-[11px] bg-black border-y-white max-[800px]:h-[30px]"/>
                                    <button onClick={handleIncrement} className="rounded-r-xl btn-square border border-white max-[800px]:w-7 bg-black max-[800px]:h-[30px]">+</button>
                                </div>
                            </div>
                            {/*    mint按钮*/}
                            <span className="flex items-center ml-4">
                                    {launchpadDetail.network !== null && <img className="w-[22px] h-[22px] max-[800px]:w-[13px] max-[800px]:h-[13px] mr-1" src={addressIcon[launchpadDetail.network] && addressIcon[launchpadDetail.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>}
                                    <span className="">{currentStepStatus === 0 ? "Free Mint" : currentStepStatus === 1 ? (parseInt(launchpadDetail.privatePrice) === 0 || launchpadDetail.privatePrice === null ? 'Free Mint' : launchpadDetail.privatePrice / 1e18) : (parseInt(launchpadDetail.publicPrice) === 0 || launchpadDetail.publicPrice === null ? 'Free Mint' : launchpadDetail.publicPrice / 1e18)}</span>
                                </span>
                        </div>
                        <button
                            disabled={checkMintButtonStatus() !== 'Mint'}
                            className={(checkMintButtonStatus() !== 'Mint'?'bg-gray-200':'bg-[#00D5DA]') + ' text-black rounded-md font-bold px-10 py-0 min-[800px]:mt-2 max-[800px]:ml-1'} onClick={() => mintNFT(0)}>{mintLoading || privateLoading || waitPrivateLoading || publicLoading || waitPublicLoading ? <span className="loading loading-spinner loading-sm"></span> : checkMintButtonStatus()}</button>
                    </div>
                </div>
            </div>
            {/*时间轴*/}
            <div className="flex justify-center font-bold">
                <div className="min-[800px]:mt-10 mb-10 block min-[800px]:w-[80%] max-[800px]:w-[100%]">
                    <ul className="timeline justify-center max-[800px]:items-start">
                        {launchpadDetail.haveWhiteMint === 1 && <li className="w-[30%]">
                            <hr className="bg-white !h-[0.1rem]"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end text-center max-[800px]:text-xs">
                                <div>Whitelist Sale</div>
                                <div>{whiteMintCount}/{launchpadDetail.whiteMintSupply > 999999999 ? "∞" : launchpadDetail.whiteMintSupply}</div>
                                <div>{stepStatus(launchpadDetail.whiteMintStartTime, launchpadDetail.whiteMintEndTime)}</div>
                            </div>
                            <hr className="bg-white !h-[0.1rem]"/>
                        </li>}
                        {launchpadDetail.havePrivateMint === 1 && <li className="w-[30%]">
                            <hr className="bg-white !h-[0.1rem]"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end text-center max-[800px]:text-xs">
                                <div>Partnership Sale</div>
                                <div>{privateMintCount}/{launchpadDetail.privateSupply > 999999999 ? "∞" : launchpadDetail.privateSupply}</div>
                                <div>{stepStatus(launchpadDetail.privateStartTime, launchpadDetail.privateEndTime)}</div>
                            </div>
                            <hr className="bg-white  !h-[0.1rem]"/>
                        </li>}
                        {launchpadDetail.havePublicMint === 1 && <li className="w-[30%]">
                            <hr className="bg-white !h-[0.1rem]"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end  text-center max-[800px]:text-xs">
                                <div>Public Sale</div>
                                <div>{publicMintCount}/{launchpadDetail.publicSupply > 999999999 ? "∞" : launchpadDetail.publicSupply}</div>
                                <div>{stepStatus(launchpadDetail.publicStartTime, launchpadDetail.publicEndTime)}</div>
                            </div>
                            <hr className="bg-white !h-[0.1rem]"/>
                        </li>}
                        {launchpadDetail.collectionName === 'Mantera' && <li className="w-[30%]">
                            <hr className="bg-white !h-[0.1rem]"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end  text-center max-[800px]:text-xs">
                                <div>Liquidity mint</div>
                                <div>0/333</div>
                            </div>
                            <hr className="bg-white !h-[0.1rem]"/>
                        </li>}
                    </ul>
                </div>
            </div>
            <AlertComponent ref={alertRef}/>
        </div>
    )
}

export default LaunchpadDetail
