import Image from "next/image";
import InfoBox from "./InfoBox";
import React, { useEffect } from "react";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import ActionBar from "@/components/collectioninfo/ActionBar";
import ButtonGroup from "@/components/collection/ButtonGroup";
import PopupBuySell from "@/components/collection/PopupBuySell";
import PopupPlaceBids from "@/components/collection/PopupPlaceBids";
import PopupDeposit from "@/components/collection/PopupDeposit";
import PopupAddLiquidity from "@/components/collection/PopupAddLiquidity";
import { useCollection } from "@/contexts/CollectionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ButtonGroupNew from "@/components/collection/ButtonGroupNew";
import AddLiquidityButton from "@/components/collection/AddLiquidityButton";
import AddLiquidityButtonNew from "@/components/collection/AddLiquidityButtonNew";

const CollectionInfoHeader = () => {
  const { colInfo } = useCollectionInfo();

  const Box = (
    <div
      className="flex gap-1 sm:gap-5  flex-wrap mt-1"
    >

      {/* {[1, 2, 3, 4, 5].map(() => (

        <InfoBox style=" max-[800px]:px-4">
          <p className="text-sm color-[#8E8A8A] font-bold">Floor</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.floorPrice}

          </p>
          {colInfo.currencyImage && colInfo.pools.length > 0 && (
            <Image
              src={colInfo.currencyImage.src}
              alt={colInfo.currencyImage.label}
              width={28}
              height={28}
              className="inline"
            />
          )}
        </InfoBox>
      ))} */}


      <InfoBox style=" max-[800px]:px-4 ">
        <p className="text-sm color-[#8E8A8A] font-bold">Floor</p>
        <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
          {colInfo.floorPrice}

        </p>
        {colInfo.currencyImage && colInfo.pools.length > 0 && (
          <Image
            src={colInfo.currencyImage.src}
            alt={colInfo.currencyImage.label}
            width={28}
            height={28}
            className="inline"
          />
        )}
      </InfoBox>
      <InfoBox style=" max-[800px]:px-4  ">
        <p className="text-sm color-[#8E8A8A] font-bold">Top Bid</p>
        <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
          {colInfo.topBid}
        </p>
        {colInfo.currencyImage && colInfo.pools.length > 0 && (
          <Image
            src={colInfo.currencyImage.src}
            alt={colInfo.currencyImage.label}
            width={28}
            height={28}
            className="inline"
          />
        )}
      </InfoBox>
      <InfoBox style=" max-[800px]:px-4  ">
        <p className="text-sm color-[#8E8A8A] font-bold">Offer TVL</p>
        <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
          {colInfo.offerTVL}

        </p>
        {colInfo.currencyImage && colInfo.pools.length > 0 && (
          <Image
            src={colInfo.currencyImage.src}
            alt={colInfo.currencyImage.label}
            width={28}
            height={28}
            className="inline"
          />
        )}
      </InfoBox>
      <InfoBox style=" max-[800px]:px-4  ">
        <p className="text-sm color-[#8E8A8A] font-bold">Listed</p>
        <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
          {colInfo.nftAmount}
        </p>
      </InfoBox>
      <InfoBox style=" max-[800px]:px-4    ">
        <p className="text-sm color-[#8E8A8A] font-bold">Volume</p>
        <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
          {colInfo.volume}

        </p>
        {colInfo.currencyImage && colInfo.pools.length > 0 && (
          <Image
            src={colInfo.currencyImage.src}
            alt={colInfo.currencyImage.label}
            width={28}
            height={28}
            className="inline"
          />
        )}
      </InfoBox>

    </div>
  )

  const { popupOpen, popupWindow } = useCollection();
  const { languageModel } = useLanguage();


  useEffect(() => { }, []);
  // grid grid-cols-[150px,auto] sm:grid-cols-[210px,auto] grid-rows-3 gap-4 sm:gap-8
  return (
    <div>
      <div className="w-full  min-h-[150px] sm:min-h-[180px] max-[800px]:h-[100px] flex flex-wrap max-[800px]:items-center mt-2">
        <div className="size-[150px]   sm:size-[180px]  relative max-[800px]:size-[100px] w-full rounded-xl overflow-hidden">
          <Image
            objectFit="cover"
            fill
            className="absolute top-0 left-0"
            src={colInfo.image}
            alt={colInfo.name}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between items-stretch max-[800px]:justify-center ml-5 overflow-hidden ">
          <span className=" max-[800px]:text-3xl  text-4xl font-bold text-white max-[800px]:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
            {colInfo.name}
          </span>
          {/* <span className=" max-[800px]:text-3xl  text-2xl font-bold text-white max-[800px]:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
            {colInfo.address}
          </span> */}
          <div className=" max-[800px]:hidden">
            {Box}
          </div>
        </div>

      </div>

      <div className="hidden max-[800px]:block">
        {Box}
      </div>

      <div>
      {/*{colInfo.currencyImage} <br/>*/}
      </div>
      {/*<ActionBar />*/}
      <div className="flex justify-center mt-8">
      <AddLiquidityButtonNew
          collectionName={colInfo.name}
          img={colInfo.image}
          contractAddress={colInfo.address}
          currencyImage={colInfo.currencyImage}
          collectionType={colInfo.type}
          chainId={colInfo.chainId}
          type={colInfo.type}
          tokenId1155={colInfo.tokenId1155}
          floorPrice={colInfo.floorPrice}
          topBid={colInfo.topBid}
      />
      <ButtonGroupNew
          collectionName={colInfo.name}
          img={colInfo.image}
          contractAddress={colInfo.address}
          currencyImage={colInfo.currencyImage}
          collectionType={colInfo.type}
          chainId={colInfo.chainId}
          type={colInfo.type}
          tokenId1155={colInfo.tokenId1155}
          floorPrice={colInfo.floorPrice}
          topBid={colInfo.topBid}
      />
      </div>



      {popupOpen && popupWindow === "BUY" && <PopupBuySell pageType="buy" />}

      {popupOpen && popupWindow === "SELL" && <PopupBuySell pageType="sell" />}

      {popupOpen && popupWindow === "PLACEBIDS" && <PopupPlaceBids />}

      {popupOpen && popupWindow === "DEPOSIT" && <PopupDeposit />}

      {popupOpen && popupWindow === "ADD_LIQUIDITY" && <PopupAddLiquidity />}
    </div>
  );
};

export default CollectionInfoHeader;
