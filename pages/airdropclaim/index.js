import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Countdown from "@/components/airdropclaim/Countdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccount, useContractRead } from "wagmi";
import calculateTimeLeft from "@/components/utils/calculateTimeLeft";
const AirdropClaim = () => {
  const cStatus = {
    ELIGIBLE: "ELIGIBLE",
    INELIGIBLE: "INELIGIBLE",
    CLAIMED: "CLAIMED",
    ENDED: "ENDED",
  };

  const dummyTime = new Date(2024, 1, 20, 14, 34, 0, 0);
  const dummyTimeStamp = dummyTime.getTime() / 1000;
  console.log(dummyTimeStamp)
  
  const [claimStatus, setClaimStatus] = useState(null); //ELIGIBLE, INELIGIBLE, CLAIMED, ENDED
  const [claimEndTime, setClaimEndTime] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const { languageModel } = useLanguage();
  const { address: owner } = useAccount();

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
        const data = result.data
        return data;
      }

      //change the status of claiming, to show different texts. Such as: "Airdrop ended", "You are eligible" etc.
      function changeStatus(data) {
        //claimStatus priority:
        //1. CLAIM
        //2. ENDED
        //3. ELIGIBLE / INELIGIBLE
        let claimEndTimestamp = data.claimEndTime;
        let claimEndTime = new Date(claimEndTimestamp * 1000); //convert to miliseconds
        console.log(claimEndTime)
        setClaimEndTime(() => claimEndTime);
  
        let timeLeft = calculateTimeLeft(claimEndTime);
        if (timeLeft.expire) setClaimStatus(cStatus.ENDED); //AIRDROP ENDED
        else if (data.tokenAmount) { // ELIGIBLE TO CLAIM
          setClaimStatus(cStatus.ELIGIBLE);
          setUserScore(data.tokenAmount);
        } else if (!data.tokenAmount) { // INELIGIBLE TO CLAIM
          setClaimStatus(cStatus.INELIGIBLE);
          setUserScore(0);
        }
      }

      const data = await loadScore();
      if(data)
        changeStatus(data);
    };

    setup();
  }, [owner]);

  function handleClaimClick() {
    //logic here
  }

  return (
    <div className={"w-full text-[#00D5DA] " + styles.divBackground}>
      <div className="grid w-5/6 h-full grid-cols-1 grid-rows-[2fr,3fr,9fr] sm:grid-rows-[2fr,3fr,15fr] m-auto">
        <button className="self-center border-solid border-[1px] border-[#00D5DA] w-28 sm:w-40 h-8 rounded font-thin py-1">
          <FontAwesomeIcon icon={faAnglesLeft} />
          {languageModel.Back}
        </button>
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
          {claimStatus === "ELIGIBLE" && (
            <>
              <h1 className="text-2xl mt-14 sm:text-5xl">
                {languageModel.YouAreEligibleFor}:
              </h1>
              <h1>
                <span className="text-white ">{userScore}&nbsp;</span>
                $EZ
              </h1>
            </>
          )}
          {claimStatus === "CLAIMED" && (
            <>
              <h1 className="mt-20 text-2xl sm:text-5xl">
                {languageModel.YouHaveClaimed}
              </h1>
              <h1>
                <span className="text-white ">{userScore}&nbsp;</span>
                $EZ
              </h1>
            </>
          )}
          {claimStatus === "INELIGIBLE" && (
            <h1 className="mt-48 text-2xl sm:text-5xl">
              {languageModel.SorryYouAreNotEligible}
            </h1>
          )}
          {claimStatus === "ENDED" && (
            <h1 className="mt-48 text-2xl sm:text-5xl">
              {languageModel.SorryAirdropEnded}
            </h1>
          )}

          {claimStatus === cStatus.ELIGIBLE && (
            <button
              className={`text-black text-lg w-32 rounded-3xl font-bold px-2 py-1`}
              onClick={handleClaimClick}
            >
              {languageModel.Claim}
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default AirdropClaim;
