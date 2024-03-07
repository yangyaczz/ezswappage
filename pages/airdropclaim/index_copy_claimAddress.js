import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Transition } from "@headlessui/react";
import Countdown from "@/components/airdropclaim/Countdown";
import { useLanguage } from "@/contexts/LanguageContext";
import RouterABI from "../../pages/data/ABI/Router.json";
import ezswapTokenABI from "../../pages/data/ABI/EZSwapToken.json";
import { ethers } from "ethers";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
  useSignMessage,
} from "wagmi";
import calculateTimeLeft from "@/components/utils/calculateTimeLeft";
import useAlert from "@/components/alert/useAlert";
import Alert from "@/components/alert/Alert";
import BackButton from "@/components/airdropclaim/BackButton";
import { recoverMessageAddress } from "viem";

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

  const [userSignature, setUserSignature] = useState(null);
  const { languageModel } = useLanguage();
  const { setAlertMsg, showAlert, alertText } = useAlert();
  const { address: owner } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  //georli address:
  //0x875d16675264fd2Ba19784B542deD0eFA90b27f7
  //main address:
  //0x4bD3ba08a2446B93aB0F08ED1F2F388A22Ea4EEF

  const EIGHTEEN_ZEROS = 1e18;

  const [targetAddr, setTargetAddr] = useState(""); //the address in user input
  const [claimAddress, setClaimAddress] = useState(""); //the address retrieve from db to display whenever they login
  const [addrHasSubmitted, setAddrHasSubmitted] = useState(false); //set this to true if submission is successful
  const [nonce, setNonce] = useState(null);
  const [tokenToClaim, setTokenToClaim] = useState(0);
  const [signLoading, setSignLoading] = useState(false);
  const {
    data: signMessageData,
    error,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();

  //this useEffect triggers when the user clicks the Confirm button, and 'signMessage' is triggered
  React.useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        setSignLoading(() => true);
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });

        if (!error) {
          let params = {
            message: variables?.message,
            signature: signMessageData,
            address: recoveredAddress,
            claimAddress: targetAddr,
            nonce,
          };

          let result = await updateAddressInfo(params);
          if (result) {
            setAddrHasSubmitted(true);
            setClaimAddress(result.claimAddress);
          }
        } else {
          setAlertMsg(error, "alert-error");
        }
        setSignLoading(() => false);
      }
    })();
  }, [signMessageData, variables?.message]);

  useEffect(() => {
    async function queryAddressScore() {
      const params = {
        address: owner?.toLowerCase(),
        mode: "pro",
      };
      const response = await fetch("/api/queryAddressScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data?.data) {
        if (data.data.tokenAmount > 0) {
          setTokenToClaim(data.data.tokenAmount);
          setNonce(data.data.nonce);
          setClaimStatus(cStatus.ELIGIBLE);
          if (data.data.claimAddress) {
            setClaimAddress(data.data.claimAddress);
            setAddrHasSubmitted(true);
          }
        } else {
          setClaimStatus(cStatus.INELIGIBLE);
        }
      } else {
        setClaimStatus(cStatus.INELIGIBLE);
      }
    }

    if (owner) queryAddressScore();
    else setClaimStatus(cStatus.WALLET_DISCONNECTED);

    return () => {
      setTokenToClaim(0);
      setClaimStatus(null);
      setAddrHasSubmitted(false);
      setClaimAddress(null);
      setClaimStatus(null);
    };
  }, [owner]);

  async function updateAddressInfo(params) {
    return fetch("/api/airdropAddressInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  }

  function handleConfirmClick() {
    if (!owner)
      return setAlertMsg(languageModel.PleaseConnectWallet, "alert-error");
    let message = `Welcome to EZswap!\n\nThis signature is to verify that you are submitting an address as your airdrop receiving address.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nAirdrop to address:\n${targetAddr}\n\nNonce:\n${nonce}`;
    signMessage({ message });
  }

  return (
    <div className="w-full text-[#00D5DA] bg-black">
      <div className="flex flex-col items-center justify-start h-full pt-20 gap-11">
        <p className="text-3xl font-extrabold lg:whitespace-nowrap  sm:text-5xl max-[800px]:text-wrap">
          EZswap {languageModel.Airdrop}
        </p>
        {claimStatus === cStatus.ELIGIBLE && (
          <>
            <p className="text-4xl font-extrabold lg:whitespace-nowrap sm:text-7xl max-[800px]:text-wrap">
              {languageModel.YouAreEligibleFor}:
            </p>
            <p
              className={
                "text-4xl font-extrabold lg:whitespace-nowrap sm:text-7xl max-[800px]:text-wrap " +
                styles.slideIn
              }
            >
              <span className={`text-white `}>{tokenToClaim}</span> $EZSWAP
            </p>
            {/*<p className="text-4xl font-extrabold lg:whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl max-[800px]:text-wrap">*/}

            {/*</p>*/}

            <p className="flex flex-col items-center justify-center text-white">
              <span className="text-xs sm:text-sm">
                {languageModel.EnterMantaAddressForAirdrop}.
              </span>
              <span className="text-[0.6rem] sm:text-sm">
                {languageModel.EZTokenAirdropShortly}.
              </span>
            </p>

            <Transition
              show={!addrHasSubmitted}
              className="flex w-1/2 h-10 transition-all"
            >
              <input
                className="w-2/3 pl-2 text-sm text-white bg-black border-[1px] border-r-0 border-white outline-none sm:w-5/6 rounded-l-xl h-full"
                type="text"
                value={targetAddr}
                onChange={(e) => setTargetAddr(e.target.value)}
              />
              <button
                onClick={handleConfirmClick}
                className="w-1/3 text-xs sm:text-base sm:w-1/6 rounded-r-xl text-black bg-[#00D5DA] font-bold border-[1px] border-white h-full"
              >
                {signLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  languageModel.Confirm
                )}
              </button>
            </Transition>

            <Transition
              show={addrHasSubmitted}
              enter="transition-opacity duration-[2000ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              className="flex flex-col items-center justify-center w-1/2 text-white transition-all"
            >
              <p>{languageModel.YourAddressIsRecorded}</p>
              <p className="text-[#00D5DA]">{claimAddress}</p>
            </Transition>
          </>
        )}
        {claimStatus === cStatus.INELIGIBLE && (
          <p className=" mt-24 sm:mt-28 text-2xl font-extrabold lg:whitespace-nowrap sm:text-7xl max-[800px]:text-wrap">
            {languageModel.SorryYouAreNotEligible}
          </p>
        )}
        {claimStatus === cStatus.WALLET_DISCONNECTED && (
          <p className=" mt-24 sm:mt-28 text-base font-extrabold lg:whitespace-nowrap sm:text-3xl lg:text-5xl max-[800px]:text-wrap">
            {languageModel.ConnectWalletCheckEligibility}
          </p>
        )}
      </div>
      {showAlert && <Alert alertText={alertText} />}
    </div>
  );
};

export default AirdropClaim;
