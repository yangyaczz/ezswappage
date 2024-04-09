import React, { useState } from "react";

import multiSetFilterPairMode from "./swapUtils/multiSetFilterPairMode";
import styles from "./index.module.scss";
import addressSymbol from "@/pages/data/address_symbol";
import { useLanguage } from "@/contexts/LanguageContext";

const TokenSearch = ({
  swapType,
  formikData,
  owner,
  reset23,
  setToken,
  setTokenName,
  setFilterPairs,
  setSwapMode,
}) => {
  const {languageModel} = useLanguage();
  const handleTokenClick = (tokenName) => {
    reset23();

    // use tokenName to get token
    let token = formikData.golbalParams.recommendERC20.find(
      (obj) => obj.name.toLowerCase() === tokenName.toLowerCase()
    ).address;

    setToken(token);
    setTokenName(tokenName);

    let filteredData = formikData.pairs;
    multiSetFilterPairMode(
      swapType,
      formikData,
      filteredData,
      owner,
      token,
      setFilterPairs,
      setSwapMode
    );
  };

  const displayDialog = () => {
    if (!formikData.collection.address) {
      return <div>{languageModel.SelectCollectionFirst}...</div>;
    }

    if (formikData.collection.address && formikData.pairs === "") {
      return <div>{languageModel.Loading}...</div>;
    }

    if (formikData.collection.address && !formikData.pairs.length) {
      return <div>{languageModel.ThisCollectionHasNoLiquidity}</div>;
    }

    return formikData.tokensName.map((tokenName, index) => (
      <button
        key={index}
        className="justify-start btn border border-1 border-white hover:border-white "
        onClick={() => handleTokenClick(tokenName)}
      >
        {tokenName}
      </button>
    ));
  };

  return (
    <div className="form-control">
      <button
        disabled={!formikData.collection.type}
        className={"btn justify-between w-[240px] md:w-[300px] border border-1 bg-black border-white hover:border-white " + " " + styles.buttonDisabled}
        onClick={() => document.getElementById("token_search_sell").showModal()}
      >
        <div className="flex items-center text-sm justify-start space-x-2">
          <div>
            {formikData.tokenName === 'ETH' && addressSymbol[formikData.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : formikData.tokenName ? formikData.tokenName : languageModel.SelectToken}
          </div>
          {/*<svg*/}
          {/*  width="12"*/}
          {/*  height="7"*/}
          {/*  viewBox="0 0 12 7"*/}
          {/*  fill="none"*/}
          {/*  xmlns="http://www.w3.org/2000/svg"*/}
          {/*>*/}
          {/*  <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>*/}
          {/*</svg>*/}
        </div>
        <div className="justify-end">
          {formikData.totalGet ? formikData.totalGet.toFixed(5) : 0}
        </div>
      </button>

      <dialog id="token_search_sell" className="modal">
        <div className="modal-box bg-black border border-1 border-white">
          <h3 className="mb-6 text-lg font-bold flex justify-center">{languageModel.Token}</h3>
          <div className="border-t-[0.1px] border-white mb-10">
          </div>
          <form method="dialog" className="flex flex-col space-y-2">
            {displayDialog()}
          </form>

          <form method="dialog">
            <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-5">
              ✕
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>{languageModel.Close}</button>
        </form>
      </dialog>
    </div>
  );
};

export default TokenSearch;
