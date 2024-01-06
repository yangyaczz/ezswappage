import { useCollection } from "@/contexts/CollectionContext";
import { REDIRECT_URL } from "@/config/constant";
import {useNetwork} from "wagmi";
import React, {useEffect, useState} from "react";
import styles from "../swap/index.module.scss";
import { useLanguage } from "@/contexts/LanguageContext";

const AddLiquidityButton = ({
  collectionName,
  contractAddress,
  collectionType,
  chainId,
  type,
  tokenId1155,
}) => {
  const { openPopup } = useCollection();
  const {languageModel} =useLanguage();
  const { chain } = useNetwork();

    const svgError = (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
    function showErrorAlert(msg) {
        setAlertText({
            className: 'alert-error',
            text: msg,
            svg: svgError,
        })
        setShowAlert(true);
    }
    const [alertText, setAlertText] = useState({
        className: '',
        text: '',
        svg: '',
    })
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

  function handleAddLiquidityClick() {
      console.log('chainaaa', chain, parseInt(chainId, 16));
      if (chain === undefined) {
          showErrorAlert('please connect wallet');
          return
      }
      if (chain.id !== parseInt(chainId, 16)){
          showErrorAlert('Please switch to right chain');
          return
      }
    // openPopup("ADD_LIQUIDITY", collectionName);

    let url = `${REDIRECT_URL}#/pool/create?contractAddress=${contractAddress}&collectionType=${collectionType}&chainId=${chainId}&poolType=2`;
    url = type === "ERC1155" ? url + `&tokenId=${tokenId1155}` : url;

    window.open(url, `newTab_${Date.now()}`);
  }

  return (
    <section className="flex items-start justify-end md:items-center md:flex-nowrap gap-x-4">
      <button
        className="btn ezBtn ezBtnPrimary !font-extrabold !bg-[#00D5DA] btn-xs lg:btn-sm w-20 sm:w-24 min-[816px]:w-28 lg:w-36 xl:w-40 h-10 lg:h-11"
        onClick={handleAddLiquidityClick}
      >
        {languageModel.AddLiquidity}
      </button>
      {/* <p className="text-[0.45rem] font-normal lg:text-sm md:font-semibold">{languageModel.AddLiquidityToEarn}</p> */}
        {showAlert && <div className={styles.alertPosition}>
            <div className={'alert'+" "+ alertText.className+ " "+styles.alertPadding}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{alertText.text}</span>
            </div>
        </div>}
    </section>
  );
};

export default AddLiquidityButton;
