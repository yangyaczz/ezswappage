import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { MaxFiveDecimal } from "../utils/roundoff";
import {
  ladderPercentagePrice,
  ladderLinearPrice,
  constantPrice,
} from "../utils/collectionUtils";
import PopupHeader from "./PopupHeader";
import {useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import FactoryABI from "../../pages/data/ABI/Factory.json";
import {ethers} from "ethers";
import { TradePoolLiner, TradePoolExp} from "../utils/calculate";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import AlertComponent from "./../common/AlertComponent";

const PopupDeposit = ({ handleApproveClick = () => {} }) => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const [maxSizeAllowed, setMaxSizeAllowed] = useState(1000000);
  const {
    selectedNFTs,
    selected1155NFTAmount,
    tokenId1155,
    selectNFTs,
    constant_ladder,
    percent_linear,
    deltaValue,
    setNFTListviewPrices,
    currencyImage,
    NFTList,
    collectionAddr
  } = useCollection();
  const radioRef = useRef(
    tokenId1155 ? selected1155NFTAmount : selectedNFTs.length
  );
  const [loadingCreatePool, setLoadingCreatePool] = useState(false);
  const [listingPrice, setListingPrice] = useState(0);
  const [tradeFee, setTradeFee] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const {chain} = useNetwork();
  const {address: owner} = useAccount();
  const alertRef = useRef(null);
  const [createPoolValue, setCreatePoolValue] = useState({});
  const [createPoolBidsValue, setCreatePoolBidsValue] = useState({});
  const [nftApproval, setNftApproval] = useState(false);
  const [size, setSize] = useState(1);

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = tokenId1155
      ? selected1155NFTAmount
      : selectedNFTs.length;
  }, [selectedNFTs, selected1155NFTAmount, tokenId1155]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId, _index) {
    selectNFTs(tokenId, _index);
  }

  useEffect(() => {
    calculateCreatePoolValue()
  }, [
    listingPrice,
    selectedNFTs.length,
    selected1155NFTAmount,
    constant_ladder,
    percent_linear,
    deltaValue,
    size,
    tradeFee
  ]);

  function calculateCreatePoolValue(){
    let NFTAmount = tokenId1155 ? selected1155NFTAmount : selectedNFTs.length;

    // console.log('listingPrice deltaValue',listingPrice, deltaValue, NFTAmount)
    let result;
    let bidsresult;
    const smallTradeFee = tradeFee* 0.01
    if (constant_ladder === "CONSTANT") {
      result = TradePoolLiner(Number(listingPrice), 0, smallTradeFee , 0.01,NFTAmount, 'create')
      setCreatePoolValue(result)
      bidsresult = TradePoolLiner(Number(listingPrice), 0, smallTradeFee, 0.01,size, 'create')
      setCreatePoolBidsValue(bidsresult)
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        result=TradePoolExp(Number(listingPrice), deltaValue, smallTradeFee, 0.01, NFTAmount, 'create')
        setCreatePoolValue(result)
        bidsresult=TradePoolExp(Number(listingPrice), deltaValue, smallTradeFee, 0.01, size, 'create')
        setCreatePoolValue(result)
        setCreatePoolBidsValue(bidsresult)
      } else if (percent_linear === "LINEAR") {
        setMaxSizeAllowed(Math.floor(Number(listingPrice)/deltaValue))
        result = TradePoolLiner(Number(listingPrice), deltaValue, smallTradeFee, 0.01, NFTAmount, 'create')
        setCreatePoolValue(result)
        bidsresult = TradePoolLiner(Number(listingPrice), deltaValue, smallTradeFee, 0.01, size, 'create')
        setCreatePoolBidsValue(bidsresult)
      }
    }
    let avgPrice = parseFloat(result.userBuyPrice) / NFTAmount;
    avgPrice = !avgPrice ? 0 : avgPrice;
    setAvgPrice(parseFloat(avgPrice).toFixed(MaxFiveDecimal(avgPrice)));
    console.log('起始价格', listingPrice,'deltaValue', deltaValue,'NFTAmount',NFTAmount ,'tradeFee ', smallTradeFee ,'计算后的结果卖', result, '计算后的结果买', bidsresult)
  }


  const {data: createPairETHData, isLoading, isSuccess, write: doCreateSellPool, status: swapStatus, error: swapError,} = useContractWrite({address: networkConfig[chain.id].factory, abi: FactoryABI, functionName: "createPairETH",
    args: [[
      collectionAddr,
      constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear:networkConfig[chain.id].exponential,
      '0x0000000000000000000000000000000000000000',
      2,
      createPoolValue?.delta === undefined || isNaN(createPoolValue?.delta) ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
      tradeFee === undefined || isNaN(tradeFee) ? 0: ethers?.utils?.parseEther((tradeFee * 0.01).toString()).toString(),
      createPoolValue?.spotPrice === undefined || isNaN(createPoolValue?.spotPrice) ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
      selectedNFTs
    ]],
    value: createPoolBidsValue === undefined || createPoolBidsValue.poolBuyPrice===undefined||createPoolBidsValue.poolBuyPrice === 0 || isNaN(createPoolBidsValue.poolBuyPrice) ?0: ethers.utils.parseEther(createPoolBidsValue?.poolBuyPrice?.toString()),
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
    write: doCreateSellPool1155,
    status: createPair1155ETHSwapStatus,
    error: createPair1155ETHSwapError,
  } = useContractWrite({
    address: networkConfig[chain.id].factory,
    abi: FactoryABI,
    functionName: "createPair1155ETH",
    args: [[
      collectionAddr,
      constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear : networkConfig[chain.id].exponential,
      '0x0000000000000000000000000000000000000000',
      2,
      createPoolValue?.delta === undefined || isNaN(createPoolValue?.delta) ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
      tradeFee === undefined || isNaN(tradeFee) ? 0: ethers?.utils?.parseEther((tradeFee * 0.01).toString()).toString(),
      createPoolValue?.spotPrice === undefined || isNaN(createPoolValue?.spotPrice) ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
      tokenId1155,
      selected1155NFTAmount
    ]],
    value: createPoolBidsValue === undefined || createPoolBidsValue.poolBuyPrice===undefined||createPoolBidsValue.poolBuyPrice === 0 || isNaN(createPoolBidsValue.poolBuyPrice) ?0: ethers.utils.parseEther(createPoolBidsValue?.poolBuyPrice?.toString()),
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
      alertRef.current.showSuccessAlert("Create Pool Success");
    },
    onError(err) {
      console.log(err)
      alertRef.current.showErrorAlert("Create Pool Fail");
    },
  });

  function createSellPool(){
    let NFTAmount = tokenId1155 ? selected1155NFTAmount : selectedNFTs.length;
    if (NFTAmount <= 0) {
      alertRef.current.showErrorAlert("The number of NFTs cannot be 0");
      return;
    }
    if (createPoolValue.poolSellPrice <= 0) {
      alertRef.current.showErrorAlert("Total Price must be greater than 0");
      return;
    }
    if (createPoolBidsValue.poolBuyPrice <= 0) {
      alertRef.current.showErrorAlert("Total Bid must be greater than 0");
      return;
    }
    if (createPoolValue.spotPrice <= 0) {
      alertRef.current.showErrorAlert('Invalid StartPrice or Delta parameter!')
      return false
    }
    if (constant_ladder === "LADDER" && percent_linear === "PERCENT" && deltaValue <= 0) {
      alertRef.current.showErrorAlert("delta must be greater than 0");
      return;
    }
    calculateCreatePoolValue()
    setLoadingCreatePool(true)
    if (!nftApproval) {
      approveNFT()
    }else {
      goCreateSellPool()
    }
  }


  function goCreateSellPool(){
    calculateCreatePoolValue()
    if (tokenId1155 === null || tokenId1155 ==='') {
      // console.log([
      //   collectionAddr,
      //   constant_ladder === "CONSTANT" || percent_linear === "LINEAR" ? networkConfig[chain.id].linear:networkConfig[chain.id].exponential,
      //   owner,
      //   0,
      //   createPoolValue?.delta === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.delta?.toString()).toString(),
      //   0,
      //   createPoolValue?.spotPrice === undefined ? 0 : ethers?.utils?.parseEther(createPoolValue?.spotPrice?.toString()).toString(),
      //   selectedNFTs
      // ])
      doCreateSellPool()
    }else {
      doCreateSellPool1155()
    }
  }



  const {data: approveNFTData, isLoading: approveLoading, isSuccess: approveSuccess, write: approveNFT, status: approveStatus, error: approveError,
  } = useContractWrite({
    address: collectionAddr,
    abi: ERC721EnumABI,
    functionName: "setApprovalForAll",
    args: [networkConfig[chain.id].factory, true],
    onError(err) {
      setLoadingCreatePool(false)
    },
    onSettled(data, error) {
      setLoadingCreatePool(false)
    }
  });
  const { data: nftApprovalData } = useContractRead({
    address: collectionAddr,
    abi: ERC721EnumABI,
    functionName: "isApprovedForAll",
    args: [owner, networkConfig[chain.id].factory],
    watch: true,
    onSuccess(data) {
      // console.log('SwapButton isApprovedForAll', data)
      // if (data) {
      setNftApproval(data);
      // }
    },
  });
  const {
    waitApproveData,
    waitApproveIsError,
    isLoading: waitApproveLoading,
  } = useWaitForTransaction({
    hash: approveNFTData?.hash,
    confirmations: 1,
    onSuccess(data) {
      alertRef.current.showSuccessAlert("Approve Success");
      // console.log('起始价', bidPrice,'指数',deltaValue*0.01+1,'数量',size,collectionAddr,'nft列表,', NFTList,tokenId1155,chain.id, networkConfig[chain.id].factory)
      goCreateSellPool()
    },
    onError(err) {
      alertRef.current.showErrorAlert("Approve Fail");
    },
  });
  return (
      <div className="overflow-scroll">
        <AlertComponent ref={alertRef} />

    <PopupBlurBackground>
      <div className="max-[800px]:flex max-[800px]:flex-col grid items-center w-full h-full grid-cols-2 text-sm text-white content-stretch gap-x-4 justify-items-center md:text-base lg:text-lg">
        <NFTListView handleNFTClicked={handleNFTClicked} styleClass="p-4 border border-white border-solid w-full max-w-[400px] h-full rounded-md max-[800px]:mb-3"/>
        <section id="NFT_Controller_Section"
          className="max-[800px]:h-4/6 grid grid-cols-1 grid-rows-[2fr,auto,auto,3fr,auto,auto,auto] gap-y-2 justify-items-center min-[800px]:h-full rounded-md max-[800px]:w-full  max-[800px]:pb-10">
          <PopupHeader handlePriceClick={(price) => setListingPrice(price)} styleClass="px-4 py-1 border border-white border-solid w-full max-w-[400px] content-center"/>
          <NFTsSelectedRange radioRef={radioRef} styleClass="px-4 py-1 border border-white border-solid w-full max-w-[400px] rounded-md"/>
          <section id="list_nft_price" className="flex items-center justify-between border border-white border-solid w-full max-w-[400px] px-4 py-1 rounded-md">
            <p className="text-sm font-bold sm:text-base lg:text-lg ">Listing Price:</p>
            <div className="relative flex items-center justify-center">
              <input
                type="number"
                min={0}
                placeholder="Amount"
                className="rounded-none	bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
                value={listingPrice}
                onChange={(e) => setListingPrice(parseFloat(e.target.value))}
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
          <ConstantLadderSelection popupType="deposit"
            styleClass="grid grid-cols-1 grid-rows-auto self-start gap-2 px-4 py-1 border border-white border-solid w-full max-w-[400px] rounded-md"/>

          <section id="trade_fee" className="flex items-center justify-between border border-white border-solid w-full max-w-[400px] px-4 py-1 rounded-md">
            <p className="text-sm font-bold sm:text-base lg:text-lg ">Trade Fee:</p>
            <div className="relative flex items-center justify-center">
              <input type="number" min={0} placeholder="Amount"
                  className="rounded-none bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
                  value={tradeFee}
                  onChange={(e) => setTradeFee(parseFloat(e.target.value))}/>
              <span className="absolute right-0">%</span>
            </div>
          </section>

          <section id="place_bid_size" className="flex justify-between border border-white border-solid w-full max-w-[400px] items-center px-4 py-2  rounded-md">
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
              <button className="w-6 h-6 bg-black border-l-2 border-l-white pl-1" onClick={() =>
                  setSize((size) =>
                      size < maxSizeAllowed ? ++size : maxSizeAllowed
                  )
              }
              >
                +
              </button>
            </div>
          </section>

          {/*<div className="flex justify-between px-4 py-1 border border-white border-solid w-full max-w-[400px] rounded-md">*/}
          {/*  <label>Average Price:</label>*/}
          {/*  <p>*/}
          {/*    {avgPrice}*/}
          {/*    <Image*/}
          {/*      src={currencyImage?.src}*/}
          {/*      alt={currencyImage?.label}*/}
          {/*      width={20}*/}
          {/*      height={20}*/}
          {/*      className="inline -translate-y-1"*/}
          {/*    />*/}
          {/*  </p>*/}
          {/*</div>*/}
          <div className="flex justify-between px-4 py-1 border border-white border-solid w-full max-w-[400px] rounded-md">
            <label>Total Bids:</label>
            <p>
              {isNaN(createPoolBidsValue.poolBuyPrice) ? 0:parseFloat(createPoolBidsValue.poolBuyPrice).toFixed(MaxFiveDecimal(createPoolBidsValue.poolBuyPrice))}
              <Image
                src={currencyImage?.src}
                alt={currencyImage?.label}
                width={20}
                height={20}
                className="inline -translate-y-1 mt-1 ml-1"
              />
            </p>
          </div>
          <div className="flex justify-between px-4 py-1 border border-white border-solid w-full max-w-[400px] rounded-md">
            <label>Total Price:</label>
            <p>
              {isNaN(createPoolValue.userBuyPrice)?0:parseFloat(createPoolValue.userBuyPrice).toFixed(MaxFiveDecimal(createPoolValue.userBuyPrice))}
              <Image
                  src={currencyImage?.src}
                  alt={currencyImage?.label}
                  width={20}
                  height={20}
                  className="inline -translate-y-1 mt-1 ml-1"
              />
            </p>
          </div>
          <button
            className={`btn ezBtn ezBtnPrimary btn-sm w-36  ${NFTList && NFTList.length > 0 ? "" : "!bg-zinc-500"}`}
            onClick={() => createSellPool()}
            disabled={NFTList.length > 0 ? false : true}>
            {loadingCreatePool || waitApproveLoading || waitTrxLoading || createPair1155ETHLoading || isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Confirm"}
          </button>

          <div className="min-[799px]:hidden max-[800px]:invisible">a</div>
        </section>
      </div>
    </PopupBlurBackground>
      </div>
  );
};

export default PopupDeposit;
