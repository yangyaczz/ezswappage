import { useCollection } from "@/contexts/CollectionContext";
import { REDIRECT_URL } from "@/config/constant";
import React, { useEffect, useState } from "react";
import styles from "../swap/index.module.scss";
import { useNetwork } from "wagmi";
import { useLanguage } from "@/contexts/LanguageContext";

const ButtonGroupNew = ({
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
    console.log('aaaaaa')

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

  const style="w-32 h-10 border-solid border-[1px] border-[#00D5DA] font-bold p-2 text-sm rounded-[40px] hover:outline hover:outline-offset-2 hover:outline-1 hover:outline-[#00D5DA]"

  return (
    <section className="flex justify-center md:items-center gap-x-2 md:gap-x-4 lg:gap-x-8">

      <button className={`${style}`}
        onClick={handlePlaceBidClick}
      >
        {languageModel.PlaceBid}
      </button>
      <button className={`${style}`}
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

export default ButtonGroupNew;
