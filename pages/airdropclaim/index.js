import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Countdown from "@/components/airdropclaim/Countdown";

const AirdropClaim = () => {
  const [claimAvailable, setClaimAvailable]= useState(false);

  function handleClaimClick(){
    if(!claimAvailable) return;

    //logic here
  }
  
  return (
    <div className={"w-full text-[#00D5DA] " + styles.divBackground} >
      <div className="grid w-5/6 h-full grid-cols-1 grid-rows-[2fr,3fr,9fr] sm:grid-rows-[2fr,3fr,15fr] m-auto">
        <button className="self-center border-solid border-[1px] border-[#00D5DA] w-28 sm:w-40 h-8 rounded font-thin py-1">
          <FontAwesomeIcon icon={faAnglesLeft} />
          Back
        </button>
        <section
          id="header"
          className="flex items-center justify-center sm:justify-between  border-b-[1px] border-[#00D5DA] flex-wrap md:flex-nowrap"
        >
          <div className="flex flex-row items-center justify-start gap-3">
            <img src="/ezicon.svg" alt="logo" />
            <p className="text-4xl font-extrabold whitespace-nowrap md:text-xl lg:text-2xl xl:text-4xl">EZswap Airdrop</p>
          </div>
          <Countdown setClaimAvailable={setClaimAvailable}/>

        </section>
        <section
          id="claiming-section"
          className="flex flex-col items-center justify-start text-5xl font-black gap-y-11 "
        >
          <h1 className="text-2xl mt-11 sm:text-5xl">You are eligible for:</h1>
          <h1>
            <span className="text-white ">999&nbsp;</span>
            $EZ
          </h1>
          <button className={`text-black text-lg w-32 rounded-3xl font-bold px-2 py-1 ${claimAvailable?"bg-[#00D5DA]":"bg-gray-500"}`} disabled={!claimAvailable} onClick={handleClaimClick}>
            Claim
          </button>
        </section>
      </div>
    </div>
  );
};

export default AirdropClaim;
