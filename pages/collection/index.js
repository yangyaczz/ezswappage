import React, { useState, useEffect } from "react";

import networkConfig from "../data/networkconfig.json";
import { useNetwork, useContractWrite, useWaitForTransaction } from "wagmi";
import { useFormik } from "formik";
import CollectionList from "@/components/collection/CollectionList";
import PopupDeposit from "@/components/collection/PopupDeposit";
import PopupPlaceBids from "@/components/collection/PopupPlaceBids";
import PopupAddLiquidity from "@/components/collection/PopupAddLiquidity";
import PopupBuySell from "@/components/collection/PopupBuySell";
import { useCollection } from "@/contexts/CollectionContext";

const Collection = () => {
  const { popupOpen, popupWindow } = useCollection();

  return (
    <div className="flex flex-col justify-start gap-x-6 items-center w-full relative bg-black self-stretch justify-self-stretch">
      <header className="flex flex-col justify-around items-center h-32">
        <h1 className="text-xl sm:text-3xl lg:text-4xl">
          Add liquidity & earn profit on your NFTs
        </h1>
      </header>
      <CollectionList />

      {popupOpen && popupWindow === "BUY" && <PopupBuySell pageType="buy" />}

      {popupOpen && popupWindow === "SELL" && <PopupBuySell pageType="sell" />}

      {popupOpen && popupWindow === "PLACEBIDS" && <PopupPlaceBids />}

      {popupOpen && popupWindow === "DEPOSIT" && <PopupDeposit />}

      {popupOpen && popupWindow === "ADD_LIQUIDITY" && <PopupAddLiquidity />}
    </div>
  );
};

export default Collection;
