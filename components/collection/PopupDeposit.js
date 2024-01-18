import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
} from "../utils/testCalculation";
import PopupHeader from "./PopupHeader";

const PopupDeposit = ({ handleApproveClick }) => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const MAX_SIZE_ALLOWED = 10000;
  const {
    selectedNFTs,
    collectionName,
    collectionImageUrl,
    floorPrice,
    topBid,
    selectNFTs,
    constant_ladder,
    percent_linear,
    ladderValue,
    setNFTList,
  } = useCollection();
  const radioRef = useRef(selectedNFTs.length);
  const [listingPrice, setListingPrice] = useState(0);

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = selectedNFTs.length;
  }, [selectedNFTs]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId) {
    selectNFTs(tokenId);
  }

  function handlePriceChange(e) {
    let totalBid = 0,
      priceList = [];

    if (constant_ladder === "CONSTANT") {
      totalBid = parseFloat(listingPrice * size).toFixed(4);
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        ({ totalBid, priceList } =
          size <= MAX_SIZE_ALLOWED
            ? ladderPercentagePrice(listingPrice, size, ladderValue)
            : totalBid);
      } else if (percent_linear === "LINEAR") {
        ({ totalBid, priceList } =
          size <= MAX_SIZE_ALLOWED
            ? ladderLinearPrice(listingPrice, size, ladderValue)
            : totalBid);
      }
    }

    setListingPrice(
      parseFloat(e.target.value).toFixed(MaxFiveDecimal(e.target.value))
    );
  }

  return (
    <PopupBlurBackground>
      <div className="grid items-center content-center w-full h-full grid-cols-2 text-sm text-white gap-x-4 justify-items-center md:text-base lg:text-lg">
        <NFTListView handleNFTClicked={handleNFTClicked} />
        {/* <div></div> */}
        <section id="NFT_Controller_Section" className="grid grid-cols-1 grid-rows-[5fr,2fr,2fr,9fr,2fr,2fr,2fr] gap-y-2 justify-items-center">
          <PopupHeader
            collectionName={collectionName}
            collectionImageUrl={collectionImageUrl}
            floorPrice={floorPrice}
            topBid={topBid}
            styleClass="px-4 py-1 border-2 border-white border-solid w-full max-w-[400px] content-center"
          />
          <NFTsSelectedRange
            radioRef={radioRef}
            styleClass="px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]"
          />
          <section
            id="list_nft_price"
            className="flex items-center justify-between border-2 border-white border-solid w-full max-w-[400px] px-4 py-1 "
          >
            <p className="text-sm font-bold sm:text-lg">Listing Price:</p>
            <div className="relative flex items-center justify-center">
              <input
                type="number"
                min={0}
                placeholder="Amount"
                className="bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
                value={listingPrice}
                onChange={handlePriceChange}
              />
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={24}
                height={24}
                className="absolute right-0"
              />
            </div>
          </section>
          <ConstantLadderSelection
            popupType="deposit"
            styleClass="grid grid-cols-1 grid-rows-auto self-start gap-2 px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]"
          />
          <div className="flex justify-between px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]">
            <label>Average Price:</label>
            <p>
              11
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={20}
                height={20}
                className="inline -translate-y-1"
              />
            </p>
          </div>
          <div className="flex justify-between px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]">
            <label>Total Price:</label>
            <p>
              11
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={20}
                height={20}
                className="inline -translate-y-1"
              />
            </p>
          </div>
          <button
            className="btn ezBtn ezBtnPrimary btn-sm w-36"
            onClick={handleApproveClick}
          >
            Confirm
          </button>
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupDeposit;
