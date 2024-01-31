import { useCollection } from "@/contexts/CollectionContext";
import { REDIRECT_URL } from "@/config/constant";
import React, { useEffect, useState } from "react";
import styles from "../swap/index.module.scss";
import { useNetwork } from "wagmi";
import { useLanguage } from "@/contexts/LanguageContext";

const ButtonGroup = ({
  collectionName,
  img,
  currencyImage,
  contractAddress,
  chainId,
  floorPrice,
  topBid,
  tokenId1155
}) => {
  const { openPopup } = useCollection();
  const { languageModel } = useLanguage();
  const { chain } = useNetwork();

  const svgError = (
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
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  function showErrorAlert(msg) {
    setAlertText({
      className: "alert-error",
      text: msg,
      svg: svgError,
    });
    setShowAlert(true);
  }
  const [alertText, setAlertText] = useState({
    className: "",
    text: "",
    svg: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  let colInfo = {
    collectionName: null,
    collectionImageUrl: null,
    floorPrice: null,
    topBid: null,
    collectionAddr:null,
    NFTs: [],
    tokenId1155:null
  };

  function handleBuyClick() {
    colInfo = {
      ...colInfo,
      collectionName,
      collectionImageUrl: img,
      floorPrice: floorPrice,
      topBid,
      currencyImage,
      collectionAddr: contractAddress,
      tokenId1155
    };
    openPopup("BUY", colInfo);
  }

  function handleSellClick() {
    colInfo = {
      ...colInfo,
      collectionName,
      collectionImageUrl: img,
      floorPrice: floorPrice,
      topBid,
      currencyImage,
      collectionAddr: contractAddress,
      tokenId1155
    };
    openPopup("SELL", colInfo);
  }

  function handlePlaceBidClick() {
    if (chain === undefined) {
      showErrorAlert("please connect wallet");
      return;
    }
    if (chain.id !== parseInt(chainId, 16)) {
      showErrorAlert("Please switch to right chain");
      return;
    }

    colInfo = {
      ...colInfo,
      collectionName,
      collectionImageUrl: img,
      floorPrice: floorPrice,
      topBid,
      currencyImage,
      collectionAddr: contractAddress,
      tokenId1155
    };
    openPopup("PLACEBIDS", colInfo);

    // let url = `${REDIRECT_URL}#/pool/create?contractAddress=${contractAddress}&collectionType=${collectionType}&chainId=${chainId}&poolType=0`;
    // url = type === "ERC1155" ? url + `&tokenId=${tokenId1155}` : url;

    // window.open(url, `newTab_${Date.now()}`);
  }

  function handleDepositClick() {
    if (chain === undefined) {
      showErrorAlert("please connect wallet");
      return;
    }
    if (chain.id !== parseInt(chainId, 16)) {
      showErrorAlert("Please switch to right chain");
      return;
    }

    colInfo = {
      ...colInfo,
      collectionName,
      collectionImageUrl: img,
      floorPrice: floorPrice,
      topBid,
      currencyImage,
      collectionAddr: contractAddress,
      tokenId1155
    };
    openPopup("DEPOSIT", colInfo);

    // let url = `${REDIRECT_URL}#/pool/create?contractAddress=${contractAddress}&collectionType=${collectionType}&chainId=${chainId}&poolType=1`;
    // url = type === "ERC1155" ? url + `&tokenId=${tokenId1155}` : url;

    // window.open(url, `newTab_${Date.now()}`);
  }
  return (
    <section className="flex items-start justify-start md:items-center gap-x-2 md:gap-x-4 lg:gap-x-8">
      {/* <button
        className="btn ezBtn ezBtnPrimaryOutline  btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handleBuyClick}
      >
        {languageModel.Buy}
      </button>
      <button
        className="btn ezBtn ezBtnPrimaryOutline btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11"
        onClick={handleSellClick}
      >
        {languageModel.QuickSell}
      </button> */}

      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA]"
        onClick={handlePlaceBidClick}
      >
        {languageModel.PlaceBid}
      </button>
      <button
        className="btn ezBtn ezBtnPrimary btn-xs lg:btn-sm w-16 sm:w-20 md:w-[6.4rem] lg:w-32 h-10 lg:h-11 !bg-[#00D5DA]"
        onClick={handleDepositClick}
      >
        {languageModel.ListNFT}
      </button>
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
    </section>
  );
};

export default ButtonGroup;
