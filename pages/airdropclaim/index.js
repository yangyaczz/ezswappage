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

  const [twitterLink, setTwitterLink] = useState("");
  const [tokenToClaim, setTokenToClaim] = useState(0);
  const [signLoading, setSignLoading] = useState(false);
  const [twitterSent, setTwitterSent] = useState(false);

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
          setClaimStatus(cStatus.ELIGIBLE);
          setTwitterSent(data.data.sendTwitter);
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
      setTwitterLink("");
    };
  }, [owner]);
  //@EZswapProtocol has launched airdrop season 2🪂🪂%0A%0AEZswap will airdrop ${tokenToClaim} $EZSWAP to my address✅✅✅%0A%0AGet ur $EZSWAP here: https://ezswap.io/%23/event/airdropOverview?inviteAddress=${owner}

  function handleTweetClick() {
    if (owner)
      window.open(
        `https://twitter.com/intent/tweet?text=🎉 Airdrop Alert! 🪂 EZswap Protocol (@EZswapProtocol) has successfully wrapped up season 2 of their airdrop! 🚀 I'm thrilled to share that ${tokenToClaim} $EZSWAP tokens are on their way to my wallet! ✅ Grab your $EZSWAP now! https://ezswap.io/airdropclaim %0A %0A %23EZswapProtocol %23Airdrop`,
        "_blank"
      );
  }

  async function handleConfirmClick() {
    if (!owner)
      return setAlertMsg(languageModel.PleaseConnectWallet, "alert-error");
    if (
      twitterLink &&
      (twitterLink.toLowerCase().indexOf("x.com") !== -1  ||
        twitterLink.toLowerCase().indexOf("twitter.com")!== -1)
    ) {
      let params = {
        address: owner,
        sendTwitter: 1,
        twitterLink: twitterLink,
      };
      let result = await updateAddressInfo(params);
      if (result) {
        setTwitterSent(true);
        setTwitterLink("");
        setAlertMsg("Airdrop recorded", "alert-success");
      }
    } else {
      setAlertMsg("Link format not correct", "alert-error");
    }
  }

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

  return (
    <div className="w-full text-[#00D5DA] bg-black" type="form">
      <div className="flex flex-col items-center justify-start h-full pt-20 gap-11">
        <p className="text-3xl font-extrabold lg:whitespace-nowrap  sm:text-5xl max-[800px]:text-wrap">
          EZswap Protocol Airdrop
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

            {twitterSent ? (
              <p>{languageModel.AirdropGranted}</p>
            ) : (
              <button
                className="bg-[#00D5DA] text-black py-2 px-3 rounded-xl font-bold"
                onClick={handleTweetClick}
              >
                {languageModel.TweetForAirdrop}
              </button>
            )}

            <div className="flex flex-row w-2/3 h-10 transition-all sm:w-1/2 justify-center max-[800px]:flex-col max-[800px]:items-center ">
              <p className="flex items-center min-[799px]:pr-3 text-base text-center text-white sm:text-base text-nowrap font-bold max-[800px]:mb-2">
                {languageModel.PasteYourPost}:
              </p>

              <div className="flex flex-row min-[799px]:w-2/3 h-10 transition-all sm:w-1/2">
                <input
                  className="grow pl-2 text-base text-white bg-black border-[1px] border-r-0 border-white outline-none rounded-l-xl max-[800px]:rounded-r-none h-full"
                  type="text"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                />
                <button
                  disabled={twitterSent}
                  onClick={handleConfirmClick}
                  className={`w-1/3 text-base sm:text-base xl:w-1/5 rounded-r-xl text-black font-bold border-[1px] border-white h-full max-[800px]:px-2 ${
                    twitterSent ? "bg-zinc-400" : "bg-[#00D5DA]"
                  }`}
                >
                  {signLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    languageModel.Confirm
                  )}
                </button>
              </div>
            </div>

            <p className="text-base text-white sm:text-base lg:text-base font-bold max-[800px]:mx-14 text-center">
              {languageModel.EZTokenAirdropSoon}
            </p>
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
