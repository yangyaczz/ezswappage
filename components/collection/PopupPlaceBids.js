import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import AlertComponent from "./../common/AlertComponent";
import PopupBlurBackground from "./PopupBlurBackground";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { MaxFiveDecimal } from "../utils/roundoff";
import {BuyPoolExp, BuyPoolLiner  } from "../utils/calculate";
import {
  ladderPercentagePrice,
  ladderLinearPrice,
  constantPrice,
} from "../utils/collectionUtils";
import PopupHeader from "./PopupHeader";
import {useAccount, useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import FactoryABI from "../../pages/data/ABI/Factory.json";
import networkConfig from "../../pages/data/networkconfig.json";
import {ethers} from "ethers";
import styles from "../swap/index.module.scss";
import {isNaN} from "formik";

const PopupPlaceBids = ({ handleApproveClick }) => {
  const [maxSizeAllowed, setMaxSizeAllowed] = useState(1000000);
  const [size, setSize] = useState(1);
  const [totalBid, setTotalBid] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const [loadingCreatePool, setLoadingCreatePool] = useState(false);
  const [createPoolValue, setCreatePoolValue] = useState({});
  const { constant_ladder, percent_linear, currencyImage, deltaValue, collectionAddr, NFTList,tokenId1155,selectedNFTs } = useCollection();
  const {chain} = useNetwork();
  const {address: owner} = useAccount();
  const alertRef = useRef(null);

  useEffect(() => {
    // let totalBid;

    // if (constant_ladder === "CONSTANT") {
    //   ({ totalPrice: totalBid } = constantPrice(Number(bidPrice), size));
    // } else if (constant_ladder === "LADDER") {
    //   if (percent_linear === "PERCENT") {
    //     ({ totalPrice: totalBid } =
    //       size <= MAX_SIZE_ALLOWED
    //         ? ladderPercentagePrice(Number(bidPrice), size, deltaValue)
    //         : { totalBid });
    //   } else if (percent_linear === "LINEAR") {
    //     ({ totalPrice: totalBid } =
    //       size <= MAX_SIZE_ALLOWED
    //         ? ladderLinearPrice(Number(bidPrice), size, deltaValue)
    //         : { totalBid });
    //   }
    // }
    //
    // setTotalBid(parseFloat(totalBid).toFixed(MaxFiveDecimal(totalBid)));
    calculateCreatePoolValue()
      // setTotalBid(parseFloat(totalBid).toFixed(MaxFiveDecimal(totalBid)));
  }, [bidPrice, size, constant_ladder, percent_linear, deltaValue]);

  function calculateCreatePoolValue(){
    let result
    if (constant_ladder === "CONSTANT") {
      result = BuyPoolLiner(Number(bidPrice), 0, 0, 0.01,size, 'create')
      setCreatePoolValue(result)
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        result = BuyPoolExp(Number(bidPrice), deltaValue, 0, 0.01, size, 'create')
        setCreatePoolValue(result)
      } else if (percent_linear === "LINEAR") {
        setMaxSizeAllowed(Math.floor(Number(bidPrice)/deltaValue))
        result = BuyPoolLiner(Number(bidPrice), deltaValue, 0, 0.01, size, 'create')
        setCreatePoolValue(result)
      }
    }
    console.log('起始价格', bidPrice,'deltaValue', deltaValue,'NFTAmount',size ,'计算后的结果', result)
  }

  const {
    data: createPairETHData,
    isLoading,
    isSuccess,
    write: doCreateBuyPool,
    status: swapStatus,
    error: swapError,
  } = useContractWrite({
    address: networkConfig[chain.id].factory,
    abi: FactoryABI,
    functionName: "createPairETH",
    args: [[
      collectionAddr,
      constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear:networkConfig[chain.id].exponential,
      owner,
        0,
      isNaN(createPoolValue?.delta) || createPoolValue?.delta === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
        0,
      isNaN(createPoolValue?.spotPrice) || createPoolValue?.spotPrice === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
      []
    ]],
    value: createPoolValue === undefined || createPoolValue.poolBuyPrice===undefined || isNaN(createPoolValue.poolBuyPrice) ? 0:ethers.utils.parseEther(createPoolValue?.poolBuyPrice?.toString()),
    onError(err) {
      setLoadingCreatePool(false)
    },
    onSettled(data, error) {
      setLoadingCreatePool(false)
    }
  });

  const {
    data: createPair1155ETHData,
    createPair1155ETHLoading,
    createPair1155ETHIsSuccess,
    write: doCreateBuyPool1155,
    status: createPair1155ETHSwapStatus,
    error: createPair1155ETHSwapError,
  } = useContractWrite({
    address: networkConfig[chain.id].factory,
    abi: FactoryABI,
    functionName: "createPair1155ETH",
    args: [[
      collectionAddr,
      constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear : networkConfig[chain.id].exponential,
      owner,
      0,
      isNaN(createPoolValue?.delta) || createPoolValue?.delta === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
      0,
      isNaN(createPoolValue?.spotPrice) || createPoolValue?.spotPrice === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
      tokenId1155,
      0
  ]],
    value: createPoolValue === undefined || createPoolValue.poolBuyPrice===undefined||createPoolValue.poolBuyPrice === 0 || isNaN(createPoolValue.poolBuyPrice) ?0: ethers.utils.parseEther(createPoolValue?.poolBuyPrice?.toString()),
    onError(err) {
      setLoadingCreatePool(false)
    },
    onSettled(data, error) {
      setLoadingCreatePool(false)
    }
  });

  useEffect(() => {
    if (swapStatus === "error") {
      if (swapError.message.indexOf("token owner or approved") > -1) {
        alertRef.current.showErrorAlert("caller is not token owner or approved");
      } else if (swapError.message.indexOf("insufficient funds") > -1) {
        alertRef.current.showErrorAlert("insufficient funds");
      }  else if (swapError.message.indexOf("insufficient balance for transfer") > -1) {
        alertRef.current.showErrorAlert("insufficient balance for transfer");
      } else {
        alertRef.current.showErrorAlert("Create Pool Error");
      }
    }
    if (createPair1155ETHSwapStatus === "error") {
      if (createPair1155ETHSwapError.message.indexOf("token owner or approved") > -1) {
        alertRef.current.showErrorAlert("caller is not token owner or approved");
      } else if (createPair1155ETHSwapError.message.indexOf("insufficient funds") > -1) {
        alertRef.current.showErrorAlert("insufficient funds");
      }  else if (createPair1155ETHSwapError.message.indexOf("insufficient balance for transfer") > -1) {
        alertRef.current.showErrorAlert("insufficient balance for transfer");
      } else {
        alertRef.current.showErrorAlert("Create Pool Error");
      }
    }

  }, [createPair1155ETHSwapStatus,swapStatus]);

  const {
    data,
    isError,
    isLoading: waitTrxLoading,
  } = useWaitForTransaction({
    hash: tokenId1155 === null || tokenId1155 ==='' ? createPairETHData?.hash:createPair1155ETHData?.hash,
    confirmations: 1,
    onSuccess(data) {
      setLoadingCreatePool(false)
      alertRef.current.showSuccessAlert("Create Pool Success");
    },
    onError(err) {
      console.log(err)
      setLoadingCreatePool(false)
      alertRef.current.showErrorAlert("Create Pool Fail");
    },
  });

  function createBuyPool(){
    if (size <= 0) {
      alertRef.current.showErrorAlert("The number of NFTs cannot be 0 !");
      return;
    }
    if (createPoolValue.poolBuyPrice <= 0) {
      alertRef.current.showErrorAlert("Total Bid must be greater than 0");
      return;
    }
    if ( constant_ladder === "LADDER" && percent_linear === "PERCENT" && deltaValue <= 0) {
      alertRef.current.showErrorAlert("delta must be greater than 0");
      return;
    }


    // console.log([
    //   collectionAddr,
    //   constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear : networkConfig[chain.id].exponential,
    //   owner,
    //   0,
    //   createPoolValue?.delta === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
    //   0,
    //   createPoolValue?.spotPrice === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
    //   [tokenId1155],
    //   size
    // ])
    // console.log('起始价', bidPrice,'指数',deltaValue*0.01+1,'数量',size,collectionAddr,'nft列表,', NFTList,tokenId1155,chain.id, networkConfig[chain.id].factory)
    calculateCreatePoolValue()
    setLoadingCreatePool(true)
    if (tokenId1155 === null || tokenId1155 ==='') {
      doCreateBuyPool()
    }else {
      doCreateBuyPool1155()
    }
  }
  return (
      <div>
        <AlertComponent ref={alertRef} />
    <PopupBlurBackground>
      <div className="grid grid-cols-1 grid-rows-[2fr,4fr,2fr,2fr,9fr,1fr,1fr] gap-y-1 justify-items-center content-center items-center w-full h-full text-sm md:text-base lg:text-lg text-white">
        <CollectionTitle>Place bid</CollectionTitle>
        <PopupHeader handlePriceClick={(price) => setBidPrice(price)} styleClass=" px-4 py-2 border border-white border-solid w-5/6 max-w-[400px] max-[800px]:w-full"
        />
        <section
          id="place_bid_bidprice"
          className="flex justify-between border border-white border-solid w-5/6 max-w-[400px] items-center px-4 py-2 rounded-md max-[800px]:w-full">
          <p className="text-sm font-bold sm:text-lg">Bid Price:</p>
          <div className="relative flex items-center justify-center">
            <input
              type="number"
              min={0}
              className="rounded-none bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
              value={bidPrice}
              onChange={(e) => setBidPrice(parseFloat(e.target.value))}
            />
            <Image
                src={currencyImage?.src}
                alt={currencyImage?.label}
              width={20}
              height={20}
              className="absolute right-0"
            />
          </div>
        </section>
        <section id="place_bid_size" className="flex justify-between border border-white border-solid w-5/6 max-w-[400px] items-center px-4 py-2  rounded-md max-[800px]:w-full">
          <p className="text-sm font-bold sm:text-lg">Size:</p>
          <div className="relative flex">
            <button className="w-6 h-6 font-bold border-r-2 border-r-white" onClick={() => setSize((size) => (size > 1 ? --size : 0))}>
              -
            </button>
            <input type="text" placeholder="0" min={1} max={maxSizeAllowed} className="w-20 h-6 text-center bg-black outline-none shrink" value={size}
              onChange={(e) => {
                if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
                  setSize(1);
                } else if (
                  parseInt(e.target.value) &&
                  parseInt(e.target.value) > maxSizeAllowed
                ) {
                  setSize(maxSizeAllowed);
                } else {
                  setSize(parseInt(e.target.value));
                }
              }}
            />
            <button className="w-6 h-6 bg-black border-l-2 border-l-white mb-1" onClick={() =>
                setSize((size) =>
                  size < maxSizeAllowed ? ++size : maxSizeAllowed
                )
              }
            >
              +
            </button>
          </div>
        </section>
        <ConstantLadderSelection id="place_bid_constantladder" popupType="placebids"
          styleClass="grid grid-cols-1 grid-rows-auto self-start gap-2 px-4 py-2 border border-white border-solid w-5/6 max-w-[400px]  rounded-md max-[800px]:w-full"/>
        <section id="place_bid_totalbids" className="flex justify-center w-5/6 max-w-[400px] items-center gap-x-1">
          <p className="font-bold">Total Bid:</p>
          <p>
            {isNaN(createPoolValue.poolBuyPrice) || createPoolValue.poolBuyPrice === undefined?0:createPoolValue.poolBuyPrice}
            <Image src={currencyImage?.src} alt={currencyImage?.label} width={20} height={20} className="inline -translate-y-1"/>
          </p>
        </section>
        <button id="place_bid_confirm_button" className={`w-32 ezBtn ezBtnPrimary btn-md`} onClick={() => createBuyPool()}>
          {loadingCreatePool || waitTrxLoading || createPair1155ETHLoading || isLoading ? <span class="loading loading-spinner loading-sm"></span> : "Confirm Bid"}
        </button>
      </div>
    </PopupBlurBackground>
      </div>
  );
};

export default PopupPlaceBids;
