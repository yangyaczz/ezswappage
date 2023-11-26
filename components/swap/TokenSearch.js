import React, { useState } from "react";

import multiSetFilterPairMode from "./swapUtils/multiSetFilterPairMode";
import styles from "./index.module.scss";
import addressSymbol from "@/pages/data/address_symbol";

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
      return <div>Please select collection first...</div>;
    }

    if (formikData.collection.address && formikData.pairs === "") {
      return <div>Loading...</div>;
    }

    if (formikData.collection.address && !formikData.pairs.length) {
      return <div>This collection has no liquidity...</div>;
    }

    return formikData.tokensName.map((tokenName, index) => (
      <button
        key={index}
        className="btn justify-start"
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
        className={"btn justify-between" + " " + styles.buttonDisabled}
        onClick={() => document.getElementById("token_search_sell").showModal()}
      >
        <div className="flex justify-start items-center space-x-2">
          <div>
            {formikData.tokenName === 'ETH' && addressSymbol[formikData.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : formikData.tokenName ? formikData.tokenName : "select token"}
          </div>
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
          </svg>
        </div>
        <div className="justify-end">
          {formikData.totalGet ? formikData.totalGet.toFixed(3) : 0}
        </div>
      </button>

      <dialog id="token_search_sell" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Token:</h3>

          <form method="dialog" className="flex flex-col space-y-2">
            {displayDialog()}
          </form>

          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default TokenSearch;
