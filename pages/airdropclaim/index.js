import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.scss";
import Countdown from "@/components/airdropclaim/Countdown";
import { useLanguage } from "@/contexts/LanguageContext";
import ezswapTokenABI from "../data/ABI/EZswap.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSendTransaction,
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
    WALLET_DISCONNECTED: "WALLET_DISCONNECTED",
  };

  // const dummyTime = new Date(2024, 0, 10, 10, 56, 0, 0);
  // const dummyTimeStamp = dummyTime.getTime() / 1000;
  // console.log(dummyTimeStamp)
  // let claimEndTimestamp = 1704855360;

  let claimEndTimestamp = 1708410840;
  let claimEndTime = new Date(claimEndTimestamp * 1000); //convert to miliseconds
  let timeLeft = calculateTimeLeft(claimEndTime);

  const [claimStatus, setClaimStatus] = useState(
    timeLeft.expire ? cStatus.ENDED : null
  ); //ELIGIBLE, INELIGIBLE, CLAIMED, ENDED
  const [tokenToClaim, setTokenToClaim] = useState(0);
  const [userSignature, setUserSignature] = useState(null);
  const { languageModel } = useLanguage();
  const { setAlertMsg, showAlert, alertText } = useAlert();
  const { address: owner } = useAccount();

  //georli address:
  //0x875d16675264fd2Ba19784B542deD0eFA90b27f7
  const ezTokenAddr = "0x875d16675264fd2ba19784b542ded0efa90b27f7";
  const userAddr = "0xF630d93650C933c34ec4Ca51901b0397069C4dCd";
  const signa =
    "0x534b9561b5086658b13721d7ae796d5d4d1cadfbc950c502537a7e6faf114c9254c80aba99fc8f1b1e2b8a595d07fab68da22ca22240bb2a69b2ef88af3737ae1c";
  const claimAmount = 10;

  const { data: userHasClaimed } = useContractRead({
    address: ezTokenAddr,
    abi: ezswapTokenABI.abi,
    functionName: "claimed",
    args: [owner?.toLowerCase()],
    onError(err) {
      if (owner) setAlertMsg(languageModel.ErrorCheckingEligibility, "alert-error");
    },
  });

  const {
    data,
    write: claimEZToken,
    isLoading: claimLoading,
  } = useContractWrite({
    address: ezTokenAddr,
    abi: ezswapTokenABI.abi,
    functionName: "claim",
    args: [owner?.toLowerCase, tokenToClaim, userSignature],
    onSuccess(data) {
      setClaimStatus(cStatus.CLAIMED);
      setAlertMsg(languageModel.ClaimIsSuccessful, "alert-success");
    },
    onError(err) {
      setAlertMsg(languageModel.ErrorClaimingToken, "alert-error");
    },
  });

  useEffect(() => {
    const setup = async () => {
      const params = {
        address: owner?.toLowerCase(),
        mode: "pro",
      };
      async function loadScore() {
        const response = await fetch("/api/queryAddressScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const result = await response.json();
        const data = result.data;
        return data;
      }

      //change the status of claiming, to show different texts. Such as: "Airdrop ended", "You are eligible" etc.
      function changeStatus(data) {
        //first verify if the token has already been claimed
        // if(data.tokenAmount > 0 && claimStatus !== cStatus.ENDED)

        //claimStatus priority:
        //1. CLAIMED
        //2. ENDED (this status is being set in the 'Countdown' component)
        //3. ELIGIBLE / INELIGIBLE
        if (userHasClaimed) {
          setClaimStatus(cStatus.CLAIMED);
          setTokenToClaim(data.tokenAmount);
        } else if (claimStatus !== cStatus.ENDED)
          if (data.tokenAmount && data.signature) {
            // ELIGIBLE TO CLAIM
            setClaimStatus(cStatus.ELIGIBLE);
            setTokenToClaim(data.tokenAmount);
            setUserSignature(data.signature);
          } else if (!data.tokenAmount) {
            // INELIGIBLE TO CLAIM
            setClaimStatus(cStatus.INELIGIBLE);
            setTokenToClaim(0);
            setUserSignature(data.signature);
          }
      }

      const data = await loadScore();
      if (data) changeStatus(data);
    };

    if (owner) setup();
    else setClaimStatus(cStatus.WALLET_DISCONNECTED);
  }, [owner, userHasClaimed]);

  function handleClaimClick() {
    //make sure user is eligible to claim,
    if (claimStatus !== cStatus.ELIGIBLE) {
      setAlertMsg(languageModel.ClaimNotAvailable, "alert-error");
      return;
    }
    //make sure owner's address and signature is present before making contract interaction
    if (!userSignature || !owner)
      setAlertMsg(languageModel.UserSignatureNotFound, "alert-error");
    else claimEZToken();
  }

  return (
    <div className={"w-full text-[#00D5DA] " + styles.divBackground}>
      <div className="grid w-5/6 h-full grid-cols-1 grid-rows-[2fr,3fr,9fr] sm:grid-rows-[2fr,3fr,15fr] m-auto">
        <BackButton />
        <section
          id="header"
          className="flex items-center justify-center sm:justify-between  border-b-[1px] border-[#00D5DA] flex-wrap md:flex-nowrap"
        >
          <div className="flex flex-row items-center justify-start gap-3">
            <img src="/ezicon.svg" alt="logo" />
            <p className="text-4xl font-extrabold whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl">
              EZswap {languageModel.Airdrop}
            </p>
          </div>
          <Countdown
            setClaimStatus={setClaimStatus}
            cStatus={cStatus}
            claimEndTime={claimEndTime}
          />
        </section>
        <section
          id="claiming-section"
          className="flex flex-col items-center justify-start text-5xl font-black gap-y-11 "
        >
          {claimStatus === cStatus.ELIGIBLE && (
            <>
              <h1 className="text-2xl mt-14 sm:text-5xl">
                {languageModel.YouAreEligibleFor}:
              </h1>
              <h1>
                <span className="text-white ">{tokenToClaim}&nbsp;</span>
                $EZ
              </h1>
            </>
          )}
          {claimStatus === cStatus.CLAIMED && (
            <>
              <h1 className="mt-20 text-2xl sm:text-5xl">
                {languageModel.YouHaveClaimed}
              </h1>
              <h1>
                <span className="text-white ">{tokenToClaim}&nbsp;</span>
                $EZ
              </h1>
            </>
          )}
          {claimStatus === cStatus.INELIGIBLE && (
            <h1 className="mt-48 text-2xl sm:text-5xl">
              {languageModel.SorryYouAreNotEligible}
            </h1>
          )}
          {claimStatus === cStatus.ENDED && (
            <h1 className="mt-48 text-2xl sm:text-5xl">
              {languageModel.SorryAirdropEnded}
            </h1>
          )}

          {claimStatus === cStatus.WALLET_DISCONNECTED && (
            <h1 className="mt-48 text-base sm:text-2xl md:text-4xl">
              {languageModel.ConnectWalletCheckEligibility}
            </h1>
          )}

          {claimStatus === cStatus.ELIGIBLE && (
            <button
              className={`text-black bg-[#00D5DA] text-lg w-32 rounded-3xl font-bold px-2 py-1`}
              onClick={handleClaimClick}
            >
              {claimLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                languageModel.Claim
              )}
            </button>
          )}
        </section>
      </div>
      {showAlert && <Alert alertText={alertText} />}
    </div>
  );
};

export default AirdropClaim;
