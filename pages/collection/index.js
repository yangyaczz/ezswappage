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
import { useLanguage } from "@/contexts/LanguageContext";

const Collection = () => {
  const { popupOpen, popupWindow } = useCollection();
  const { languageModel } = useLanguage();
  return (
    <div className="flex ">
      <div className="relative flex flex-col items-center self-stretch justify-start w-full bg-black gap-x-6 justify-self-stretch">
        <header className="flex flex-col items-center justify-around h-24 sm:h-32">
          <h1 className="text-xs text-white sm:text-3xl lg:text-4xl">
            {languageModel.AddLiquidityToEarn.toUpperCase()}
          </h1>
        </header>
        <CollectionList />

        {popupOpen && popupWindow === "BUY" && <PopupBuySell pageType="buy" />}

        {popupOpen && popupWindow === "SELL" && <PopupBuySell pageType="sell" />}

        {popupOpen && popupWindow === "PLACEBIDS" && <PopupPlaceBids />}

        {popupOpen && popupWindow === "DEPOSIT" && <PopupDeposit />}

        {popupOpen && popupWindow === "ADD_LIQUIDITY" && <PopupAddLiquidity />}
      </div>
    </div>
  );
};

export default Collection;
