import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useNetwork,
  useContractRead,
  useContractReads,
  useContractWrite,
  useAccount,
  erc20ABI,
  useWaitForTransaction,
} from "wagmi";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import styles from "./index.module.scss";
import RouterABI from "../../pages/data/ABI/Router.json";
import { useLanguage } from "@/contexts/LanguageContext";

const SwapButton = ({ swapType, formikData, owner, addSwapSuccessCount }) => {
  const [nftApproval, setNftApproval] = useState(false);
  const { languageModel } = useLanguage();
  const { data: nftApprovalData } = useContractRead({
    address: formikData.collection.address,
    abi: ERC721EnumABI,
    functionName: "isApprovedForAll",
    args: [owner, formikData.golbalParams.router],
    watch: true,
    onSuccess(data) {
      // console.log('SwapButton isApprovedForAll', data)
      // if (data) {
      setNftApproval(data);
      // }
    },
  });

  const {
    data: approveNFTData,
    isLoading: approveLoading,
    isSuccess: approveSuccess,
    write: approveNFT,
    status: approveStatus,
    error: approveError,
  } = useContractWrite({
    address: formikData.collection.address,
    abi: ERC721EnumABI,
    functionName: "setApprovalForAll",
    args: [formikData.golbalParams.router, true],
  });

  const {
    data: robustSwapNFTsForTokenData,
    isLoading,
    isSuccess,
    write: swapNFTToToken,
    status: swapStatus,
    error: swapError,
  } = useContractWrite({
    address: formikData.golbalParams.router,
    abi: RouterABI,
    functionName: "robustSwapNFTsForToken",
    args: [
      formikData.tupleEncode,
      owner,
      Date.parse(new Date()) / 1000 + 60 * 3600,
    ],
  });
  const {
    waitApproveData,
    waitApproveIsError,
    isLoading: waitApproveLoading,
  } = useWaitForTransaction({
    hash: approveNFTData?.hash,
    confirmations: 1,
    onSuccess(data) {
      showSuccessAlert("Approve Success");
      swapNFTToToken();
    },
    onError(err) {
      showErrorAlert("Approve Fail");
    },
  });
  const {
    data: robustSwapETHForSpecificNFTsData,
    write: swapETHToNFT,
    isSuccess: swapETHToNFTIsSuccess,
    isLoading: swapETHToNFTIsLoading,
  } = useContractWrite({
    address: formikData.golbalParams.router,
    abi: RouterABI,
    functionName: "robustSwapETHForSpecificNFTs",
    args: [
      formikData.tupleEncode,
      owner,
      owner,
      Date.parse(new Date()) / 1000 + 60 * 3600,
    ],
    value: formikData.totalGet
      ? ethers.utils.parseEther(formikData.totalGet.toString())
      : 0,
    onSettled(data, error) {
      console.log(data, error);
      console.log(formikData.tupleEncode);
      console.log("totalGet", formikData.totalGet);
    },
  });

  const {
    data,
    isError,
    isLoading: waitTrxLoading,
  } = useWaitForTransaction({
    hash:
      swapType === "sell"
        ? robustSwapNFTsForTokenData?.hash
        : robustSwapETHForSpecificNFTsData === undefined
        ? null
        : robustSwapETHForSpecificNFTsData.hash,
    confirmations: 1,
    onSuccess(data) {
      showSuccessAlert("Swap Success");
      addSwapSuccessCount();
    },
    onError(err) {
      showErrorAlert("Swap Fail");
    },
  });

  function doApprove() {
    approveNFT();
  }

  // function doSwapNFTToToken() {
  //     swapNFTToToken()
  // }

  function showErrorAlert(msg) {
    setAlertText({
      className: "alert-error",
      text: msg,
      svg: svgError,
    });
    setShowAlert(true);
  }

  function showSuccessAlert(msg) {
    setAlertText({
      className: "alert-success",
      text: msg,
      svg: svgSuccess,
    });
    setShowAlert(true);
  }

  useEffect(() => {
    if (approveStatus === "error") {
      if (approveError.message.indexOf("token owner or approved") > -1) {
        showErrorAlert("caller is not token owner or approved");
      } else if (approveError.message.indexOf("insufficient funds") > -1) {
        showErrorAlert("insufficient funds");
      } else {
        showErrorAlert("approve error");
      }
    }
  }, [approveStatus]);

  useEffect(() => {
    if (swapStatus === "error") {
      if (swapError.message.indexOf("token owner or approved") > -1) {
        showErrorAlert("caller is not token owner or approved");
      } else if (swapError.message.indexOf("insufficient funds") > -1) {
        showErrorAlert("insufficient funds");
      }  else if (swapError.message.indexOf("insufficient balance for transfer") > -1) {
        showErrorAlert("insufficient balance for transfer");
      } else {
        showErrorAlert("swap error");
      }
    }
  }, [swapStatus]);

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
  const svgSuccess = (
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
  );

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

  const buttonText = () => {
    let text;
    if (!formikData.collection.address) {
      text = languageModel.SelectACollection;
      return (
        <div>
          <div className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle}>{text}</div>
        </div>
      );
    }
    if (!formikData.selectIds.length > 0) {
      text = languageModel.SelectAnNFT;
      return <div className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle}>{text}</div>;
    }
    if (formikData.isExceeded) {
      return <div className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle}>{languageModel.InsufficientBalance}</div>;
    }

    if (swapType === "sell" && !nftApproval) {
      text = "Approve";
      return (
        <button className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle} onClick={() => doApprove()}>
          {approveLoading || waitApproveLoading ? (
            <span class="loading loading-spinner loading-sm"></span>
          ) : (
            text
          )}
        </button>
      );
    }

    text = "Swap";
    if (swapType === "sell") {
      // return (
      //     <>
      //         <button onClick={() => swapNFTToToken()}>
      //             {swapIsLoading ? <div>Loading...</div> : <div>{text}</div>}
      //         </button>
      //     </>
      // )
      return (
          <button className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle} onClick={() => swapNFTToToken()}>
            {isLoading || waitTrxLoading ? (
              <span class="loading loading-spinner loading-sm"></span>
            ) : (
              text
            )}
          </button>
      );
    } else if (swapType === "buy") {
      // text = 'swappp'
      // return (
      //     <>
      //         <button onClick={() => swapETHToNFT()}>
      //             {swapIsLoading ? <div>Loading...</div> : <div>{text}</div>}
      //         </button>
      //     </>
      // )
      return (
          <button className={"btn md:w-[300px] w-[240px] " + styles.buttonStyle} onClick={() => swapETHToNFT()}>
            {swapETHToNFTIsLoading || waitTrxLoading ? (
              <span class="loading loading-spinner loading-sm"></span>
            ) : (
              text
            )}
          </button>
      );
    } else {
      return null;
    }
  };

  if (!owner)
    return (
      <div className="p-6 mx-6">
        <ConnectButton />
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className={" " + "mx-6" + " " + styles.swapButton + " "}>
        {buttonText()}
      </div>
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
    </div>
  );
};

export default SwapButton;
