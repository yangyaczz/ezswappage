import React, {useState, useEffect} from "react";
import styles from "./index.module.scss";
import Countdown from "@/components/airdropclaim/Countdown";
import {useLanguage} from "@/contexts/LanguageContext";
import RouterABI from "../../pages/data/ABI/Router.json";
import ezswapTokenABI from "../../pages/data/ABI/EZSwapToken.json";
import {ethers} from "ethers";
import {
    useAccount,
    useContractRead,
    useContractWrite,
    useNetwork,
    useSwitchNetwork,
    useWaitForTransaction,
} from "wagmi";
import calculateTimeLeft from "@/components/utils/calculateTimeLeft";
import useAlert from "@/components/alert/useAlert";
import Alert from "@/components/alert/Alert";
import BackButton from "@/components/airdropclaim/BackButton";

const AirdropClaim = () => {
    const cStatus = {
        ELIGIBLE: "ELIGIBLE",
        INELIGIBLE: "INELIGIBLE",
        CLAIMED: "CLAIMED",
        ENDED: "ENDED",
        BEFORE_START: "BEFORE_START",
        WALLET_DISCONNECTED: "WALLET_DISCONNECTED",
    };

    const tStatus = {
        ENDED: "ENDED",
        ONGOING: "ONGOING",
        BEFORE_START: "BEFORE_START",
    };


    const claimStartTimestamp = 1705492800;
    const claimStartTime = new Date(claimStartTimestamp * 1000); //convert to miliseconds
    // const claimStartTime=new Date(2024, 0, 13, 11, 22, 0, 0);;
    const claimEndTimestamp = 1706623200;
    const claimEndTime = new Date(claimEndTimestamp * 1000); //convert to miliseconds
    // const claimEndTime = new Date(2024, 0, 14, 12, 34, 30, 0);
    let timeBeforeStart = calculateTimeLeft(claimStartTime);
    let timeBeforeEnd = calculateTimeLeft(claimEndTime);

    const [claimStatus, setClaimStatus] = useState(null); //ELIGIBLE, INELIGIBLE, CLAIMED, ENDED
    const [timeStatus, setTimeStatus] = useState(
        timeBeforeStart.expire
            ? timeBeforeEnd.expire
                ? tStatus.ENDED
                : tStatus.ONGOING
            : tStatus.BEFORE_START
    );
    const [tokenToClaim, setTokenToClaim] = useState(0);
    const [userSignature, setUserSignature] = useState(null);
    const {languageModel} = useLanguage();
    const {setAlertMsg, showAlert, alertText} = useAlert();
    const {address: owner} = useAccount();
    const {chain} = useNetwork();
    const {switchNetwork} = useSwitchNetwork();
    //georli address:
    //0x875d16675264fd2Ba19784B542deD0eFA90b27f7
    //main address:
    //0x4bD3ba08a2446B93aB0F08ED1F2F388A22Ea4EEF

    const ezTokenAddr = "0x4bD3ba08a2446B93aB0F08ED1F2F388A22Ea4EEF";
    const userAddr = "0x21C8e614CD5c37765411066D2ec09912020c846F";
    const signa =
        "0xb975dbbf98a2f2b5861195e0ff811062e7d999a4c76536072c737fc29e86139e0db51bace7eeeb66fe5ff15f6b34012b8e0c1d7fa2d9e06b56f22723cb1889eb1c";
    const claimAmount = 5e20;
    const deployChainId = 1;
    const EIGHTEEN_ZEROS = 1e18;

    // const { data: userHasClaimed } = useContractRead({
    //   address: ezTokenAddr,
    //   abi: ezswapTokenABI.abi,
    //   functionName: "claimed",
    //   args: [owner],
    //   onError(err) {
    //     if (chain && chain.id !== deployChainId) {
    //       setAlertMsg(languageModel.SwitchToMainnet, "alert-error");
    //       switchNetwork?.(deployChainId);
    //     } else if (owner) setAlertMsg(err.shortMessage, "alert-error");
    //   },
    // });
    //
    // const {
    //   data: claimTokenData,
    //   write: claimEZToken,
    //   isLoading: claimLoading,
    // } = useContractWrite({
    //   address: ezTokenAddr,
    //   abi: ezswapTokenABI.abi,
    //   functionName: "claim",
    //   args: [owner, ethers.utils.parseEther(tokenToClaim.toString()).toString(), userSignature],
    //   onError(err) {
    //     setAlertMsg(err.shortMessage, "alert-error");
    //   },
    // });
    //
    // const { isLoading: waitClaimLoading } = useWaitForTransaction({
    //   hash: claimTokenData?.hash,
    //   confirmations: 1,
    //   onSuccess(data) {
    //     setClaimStatus(cStatus.CLAIMED);
    //     setAlertMsg(languageModel.ClaimIsSuccessful, "alert-success");
    //   },
    //   onError(err) {
    //     setAlertMsg(err.shortMessage, "alert-error");
    //   },
    // });
    // useEffect(() => {
    //   if (chain && chain?.id !== deployChainId) {
    //     setAlertMsg(languageModel.SwitchToMainnet, "alert-error");
    //     switchNetwork?.(deployChainId);
    //   }
    // }, [chain?.id]);
    //
    // useEffect(() => {
    //   const setup = async () => {
    //     const params = {
    //       address: owner,
    //       mode: "pro",
    //     };
    //     async function loadScore() {
    //       const response = await fetch("/api/queryAddressScore", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(params),
    //       });
    //       const result = await response.json();
    //       if(result.success){
    //         const data = result.data;
    //         return data;
    //       }
    //       return null
    //     }
    //
    //     //change the status of claiming, to show different texts. Such as: "Airdrop ended", "You are eligible" etc.
    //     function changeStatus(data) {
    //       //first verify if the token has already been claimed
    //       // if(data.tokenAmount > 0 && claimStatus !== cStatus.ENDED)
    //
    //       //claimStatus priority:
    //       //1. CLAIMED
    //       //2. ENDED (this status is being set in the 'Countdown' component)
    //       //3. ELIGIBLE / INELIGIBLE
    //       if (userHasClaimed) {
    //         setClaimStatus(cStatus.CLAIMED);
    //         setTokenToClaim(data.tokenAmount);
    //       } else if (claimStatus !== cStatus.ENDED)
    //         if (data.tokenAmount && data.signature) {
    //           // ELIGIBLE TO CLAIM
    //           setClaimStatus(cStatus.ELIGIBLE);
    //           setTokenToClaim(data.tokenAmount);
    //           setUserSignature(data.signature);
    //         } else if (!data.tokenAmount) {
    //           // INELIGIBLE TO CLAIM
    //           setClaimStatus(cStatus.INELIGIBLE);
    //           setTokenToClaim(0);
    //           setUserSignature(data.signature);
    //         }
    //     }
    //
    //     const data = await loadScore();
    //     if (data) {
    //       changeStatus(data);
    //     }else {
    //       setClaimStatus(cStatus.INELIGIBLE);
    //       setTokenToClaim(0);
    //       setUserSignature("");
    //     }
    //   };
    //
    //   if (timeStatus!==tStatus.BEFORE_START){
    //     if(!owner) setClaimStatus(cStatus.WALLET_DISCONNECTED);
    //     else setup();
    //   }
    // }, [owner, timeStatus, userHasClaimed]);
    //
    // function handleClaimClick() {
    //   //make sure user is eligible to claim,
    //   if (chain && chain.id !== deployChainId) {
    //     setAlertMsg(languageModel.SwitchToMainnet, "alert-error");
    //     switchNetwork?.(deployChainId);
    //     return;
    //   }
    //
    //   if (claimStatus !== cStatus.ELIGIBLE && timeStatus!==tStatus.ONGOING) {
    //     setAlertMsg(languageModel.ClaimNotAvailable, "alert-error");
    //     return;
    //   }
    //   //make sure owner's address and signature is present before making contract interaction
    //   if(!userSignature || !owner)
    //     setAlertMsg(languageModel.UserSignatureNotFound, "alert-error");
    //   else claimEZToken();
    // }

    return (
        <div className={"w-full text-[#00D5DA] " + styles.divBackground}>
            <div className="flex flex-col items-center justify-center">
                <p className="text-4xl font-extrabold lg:whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl max-[800px]:text-wrap">
                    EZswap Airdrop
                </p>
                <p className="text-4xl font-extrabold lg:whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl max-[800px]:text-wrap">
                    You are eligible for:
                </p>
                <p className="text-4xl font-extrabold lg:whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl max-[800px]:text-wrap">
                    999 $EZSWAP
                </p>
                {/*<p className="text-4xl font-extrabold lg:whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl max-[800px]:text-wrap">*/}

                {/*</p>*/}

                <div>
                    Enter your Manta address for receiving airdrop.
                    The $EZSWAP token will be directly airdropped to you address on Manta shortly.
                </div>
                <div>
                    <input type="text"/>
                    <button>Confirm</button>
                </div>
            </div>

            {showAlert && <Alert alertText={alertText}/>}
        </div>
    );
};

export default AirdropClaim;
