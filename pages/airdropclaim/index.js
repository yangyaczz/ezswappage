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
    setAlertMsg("Airdrop End", "alert-error");
    return

    // if (!owner)
    //   return setAlertMsg(languageModel.PleaseConnectWallet, "alert-error");
    // if (
    //   twitterLink &&
    //   (twitterLink.toLowerCase().indexOf("x.com") !== -1  ||
    //     twitterLink.toLowerCase().indexOf("twitter.com")!== -1)
    // ) {
    //   let params = {
    //     address: owner,
    //     sendTwitter: 1,
    //     twitterLink: twitterLink,
    //   };
    //   let result = await updateAddressInfo(params);
    //   if (result) {
    //     setTwitterSent(true);
    //     setTwitterLink("");
    //     setAlertMsg("Airdrop recorded", "alert-success");
    //   }
    // } else {
    //   setAlertMsg("Link format not correct", "alert-error");
    // }
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
            <div className="flex flex-col items-center justify-center">
              <p className="mt-10 sm:mt-10 text-2xl font-extrabold sm:text-5xl max-[800px]:text-wrap max-[800px]:mx-6">
                Airdrop Season 3 Coming Soon, Stay Tuned! $EZSWAP
              </p>
            </div>

      </div>
      {/*{showAlert && <Alert alertText={alertText} />}*/}
    </div>
  );
};

export default AirdropClaim;
