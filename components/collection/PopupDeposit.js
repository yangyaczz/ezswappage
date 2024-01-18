import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { MaxFiveDecimal } from "../utils/roundoff";
import {ladderPercentagePrice, ladderLinearPrice} from "../utils/testCalculation";

const PopupDeposit = ({ handleApproveClick }) => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const MAX_SIZE_ALLOWED = 10000;
  const { NFTList, selectedNFTs, collectionName, floorPrice, selectNFTs, constant_ladder, percent_linear, ladderValue, setNFTList } = useCollection();
  const radioRef = useRef(selectedNFTs.length);
  const [listingPrice, setListingPrice] = useState(0)

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = selectedNFTs.length;
  }, [selectedNFTs]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId) {
    selectNFTs(tokenId);
  }

  function handlePriceChange(e){

    let totalBid=0, priceList=[];

    if (constant_ladder === "CONSTANT") {
      totalBid = parseFloat(listingPrice * size).toFixed(4);
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        ({totalBid, priceList} =
          size <= MAX_SIZE_ALLOWED
            ? ladderPercentagePrice(listingPrice, size, ladderValue)
            : totalBid);
      } else if (percent_linear === "LINEAR") {
        ({totalBid,priceList} =
          size <= MAX_SIZE_ALLOWED
            ? ladderLinearPrice(listingPrice, size, ladderValue)
            : totalBid);
      }
    }

    setListingPrice(parseFloat(e.target.value).toFixed(MaxFiveDecimal(e.target.value)))
  }

  return (
    <PopupBlurBackground>
      <div className="grid w-full h-full grid-cols-2 gap-x-4">
        <NFTListView handleNFTClicked={handleNFTClicked} />
        <section
          id="NFT_Controller_Section"
          className="grid grid-rows-[1fr,1fr,2fr,3fr,1fr,1fr] grid-cols-[2fr,7fr] gap-y-1 max-h-full"
        >
          <NFTsSelectedRange radioRef={radioRef} />
          <div className="flex flex-wrap items-start justify-start col-span-full gap-x-4">
            <p>Listing Price:</p>
            <div className="relative flex items-center justify-center">
              <input
                type="number"
                min={0}
                placeholder="Amount"
                className="input input-bordered w-[160px] max-w-xs inline pr-[35px] text-sm"
                value={listingPrice}
                onChange={handlePriceChange}
              />
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={36}
                height={36}
                className="absolute right-0"
              />
            </div>
            <p>Floor Price: {floorPrice} ETH</p>
          </div>
          <ConstantLadderSelection
            styleGrid="grid grid-cols-1 md:grid-cols-[2fr,7fr] grid-rows-[1fr,2fr]"
            popupType="deposit"
          />
          <p className="col-span-2">Average Price: 11ETH</p>
          <p className="col-span-2">Total Price: 11ETH</p>
            <button
              className="btn ezBtn ezBtnPrimaryOutline btn-sm md:btn-md w-[110px]"
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
