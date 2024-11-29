import { useCollection } from "@/contexts/CollectionContext";
import { REDIRECT_URL } from "@/config/constant";
import { useNetwork } from "wagmi";
import React, { useEffect, useState } from "react";
import styles from "../swap/index.module.scss";
import { useLanguage } from "@/contexts/LanguageContext";
import Alert from "../alert/Alert";
import useAlert from "@/components/alert/useAlert";

const AddLiquidityButtonNew = ({
  collectionName,
  img,
  currencyImage,
  contractAddress,
  chainId,
  tokenId1155,
  floorPrice,
  topBid,
}) => {
  const { openPopup } = useCollection();
  const { languageModel } = useLanguage();
  const { chain } = useNetwork();
  const { setAlertMsg, showAlert, alertText } = useAlert();

  let colInfo = {
    collectionName: null,
    collectionImageUrl: null,
    floorPrice: null,
    topBid: null,
    collectionAddr:null,
    NFTs: [],
    tokenId1155:null
  };

  function handleAddLiquidityClick() {
    console.log("chainaaa", chain, parseInt(chainId, 16));
    if (chain === undefined) {
      setAlertMsg("please connect wallet", "alert-error");
      return;
    }
    if (chain.id !== parseInt(chainId, 16)) {
      setAlertMsg("Please switch to right chain","alert-error");
      return;
    }

    colInfo = {
      ...colInfo,
      collectionName,
      collectionImageUrl: img,
      floorPrice: floorPrice,
      topBid,
      currencyImage,
      collectionAddr:contractAddress,
      tokenId1155
    };
    openPopup("ADD_LIQUIDITY", colInfo);

    // let url = `${REDIRECT_URL}#/pool/create?contractAddress=${contractAddress}&collectionType=${collectionType}&chainId=${chainId}&poolType=2`;
    // url = type === "ERC1155" ? url + `&tokenId=${tokenId1155}` : url;

    // window.open(url, `newTab_${Date.now()}`);
  }
  const style="bg-[#00D5DA] text-black w-32 h-10 border-solid border-[1px] border-[#00D5DA] font-bold p-2 text-sm rounded-[40px] hover:outline hover:outline-offset-2 hover:outline-1 hover:outline-[#00D5DA]"

  return (
    <section className="flex justify-center md:items-center md:flex-nowrap gap-x-4 mr-8">
      <button className={`${style}`}
        onClick={handleAddLiquidityClick}
      >
        {languageModel.AddLiquidity}
      </button>
      {/* <p className="text-[0.45rem] font-normal lg:text-sm md:font-semibold">{languageModel.AddLiquidityToEarn}</p> */}
      {showAlert && (
        <div className={styles.alertPosition}>
          <div
            className={
              "alert" + " " + alertText.className + " " + styles.alertPadding
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 stroke-current shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alertText.text}</span>
          </div>
        </div>
      )}
      {showAlert && <Alert alertText={alertText} />}
    </section>
  );
};

export default AddLiquidityButtonNew;
