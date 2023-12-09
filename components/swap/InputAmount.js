import React from "react";

import Input721Sell from "./swapUtils/Input721Sell";
import Input1155Sell from "./swapUtils/Input1155Sell";

import Input721Buy from "./swapUtils/Input721Buy";
import Input1155Buy from "./swapUtils/Input1155Buy";
import styles from "./index.module.scss";
import addressSymbol from "@/pages/data/address_symbol";
const InputAmount = ({
  swapType,
  formikData,
  setSelectIds,
  setTupleEncode,
  setTotalGet,
  setIsExceeded,
  setIsBanSelect,
}) => {
  const displayFrame = () => {
    if (!formikData.selectIds.length) {
      return <div>select item</div>;
    }

    return <div>amount</div>;
  };

  const displaySellDialog = () => {
    // console.log('display Sell Dialog', formikData.collection.filterPairs)

    if (!formikData.collection.type || !formikData.token) {
      return <div>Select collection and token first...</div>;
    }

    if (formikData.userCollection.tokenIds721 === "") {
      return <div>Loading...</div>;
    }

    if (formikData.pairs && formikData.filterPairs.length === 0) {
      return <div>this pair has no liquidity</div>;
    }

    if (formikData.collection.type == "ERC721") {
      return (
        <Input721Sell
          formikData={formikData}
          setSelectIds={setSelectIds}
          setTotalGet={setTotalGet}
          setTupleEncode={setTupleEncode}
          setIsExceeded={setIsExceeded}
          setIsBanSelect={setIsBanSelect}
        />
      );
    }

    if (formikData.collection.type == "ERC1155") {
      return (
        <Input1155Sell
          formikData={formikData}
          setSelectIds={setSelectIds}
          setTotalGet={setTotalGet}
          setTupleEncode={setTupleEncode}
          setIsExceeded={setIsExceeded}
        />
      );
    }
  };

  const displayBuyDialog = () => {
    // console.log('display buy Dialog', formikData.collection)

    if (!formikData.collection.type || !formikData.token) {
      return <div>Select collection and token first...</div>;
    }

    if (formikData.userCollection.tokenBalance20 === "") {
      return <div>Loading.....</div>;
    }

    if (formikData.pairs && formikData.filterPairs.length === 0) {
      return <div>this pair has no liquidity</div>;
    }

    if (formikData.collection.type == "ERC721") {
      return (
        <Input721Buy
          formikData={formikData}
          setSelectIds={setSelectIds}
          setTotalGet={setTotalGet}
          setTupleEncode={setTupleEncode}
          setIsExceeded={setIsExceeded}
        />
      );
    }

    if (formikData.collection.type == "ERC1155") {
        return (
            <Input1155Buy
                formikData={formikData}
                setSelectIds={setSelectIds}
                setTotalGet={setTotalGet}
                setTupleEncode={setTupleEncode}
                setIsExceeded={setIsExceeded}
            />
        )
    }
  };

  console.log(formikData)
  return (
    <div className="form-control">
      <button
        disabled={!formikData.collection.type}
        className={"btn justify-between" + " " + styles.buttonDisabled}
        onClick={() => document.getElementById("input_sell").showModal()}
      >
        <div className="flex justify-start items-center space-x-2">
          {displayFrame()}
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
        <div className="justify-end">{formikData.selectIds.length}</div>
      </button>

      <dialog id="input_sell" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-6">Item:</h3>

          {swapType === "buy" ? displayBuyDialog() : displaySellDialog()}

          <div>{formikData.isExceeded && "Insufficient balance"}</div>
          <div className="divider"></div>

          <h3 className="font-bold text-lg flex justify-end">
            <div>Amount:</div>
            <div className="flex ml-2">
              {/*<img className="w-6" src="/ETH.png" alt="" />*/}
              {formikData.totalGet ? formikData.totalGet.toFixed(5) : 0}&nbsp;
              {addressSymbol[formikData.golbalParams.hex] === undefined ? '' : addressSymbol[formikData.golbalParams.hex]["0x0000000000000000000000000000000000000000"]}
            </div>
          </h3>
          {/*<div className="mt-2 flex">*/}
          {/*    You have select {formikData.selectIds.length} and {swapType === 'buy'?"you need pay" : "you will get"} <img className="w-6" src="/ETH.png" alt=""/> {formikData.totalGet ? formikData.totalGet.toFixed(5):0}*/}
          {/*</div>*/}

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

export default InputAmount;
