import Image from "next/image";
import { useEffect, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { MaxFiveDecimal } from "../utils/roundoff";
import {
  ladderPercentagePrice,
  ladderLinearPrice
} from "../utils/testCalculation";
import PopupHeader from "./PopupHeader";

const PopupPlaceBids = ({ handleApproveClick }) => {
  const MAX_SIZE_ALLOWED = 10000;
  const [size, setSize] = useState(1);
  const [totalBid, setTotalBid] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const {
    collectionName, collectionImageUrl, floorPrice, topBid, constant_ladder, percent_linear, ladderValue,
  } = useCollection();

  useEffect(() => {
    let totalBid;

    if (constant_ladder === "CONSTANT") {
      totalBid = parseFloat(bidPrice * size).toFixed(MaxFiveDecimal(bidPrice * size));
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        ({ totalBid } =
          size <= MAX_SIZE_ALLOWED
            ? ladderPercentagePrice(bidPrice, size, ladderValue)
            : { totalBid });
      } else if (percent_linear === "LINEAR") {
        ({ totalBid } =
          size <= MAX_SIZE_ALLOWED
            ? ladderLinearPrice(bidPrice, size, ladderValue)
            : { totalBid });
      }
    }

    setTotalBid(parseFloat(totalBid).toFixed(MaxFiveDecimal(totalBid)));
  }, [bidPrice, size, constant_ladder, percent_linear, ladderValue]);

  return (
    <PopupBlurBackground>
      <div className="grid grid-cols-1 grid-rows-[2fr,4fr,2fr,2fr,9fr,1fr,1fr] gap-y-1 justify-items-center content-center items-center w-full h-full text-sm md:text-base lg:text-lg text-white">
        <CollectionTitle>Place bid</CollectionTitle>
        <PopupHeader collectionName={collectionName} collectionImageUrl={collectionImageUrl} floorPrice={floorPrice} topBid={topBid} handlePriceClick={(price)=>setBidPrice(price)}  styleClass=" px-4 py-2 border-2 border-white border-solid w-5/6 max-w-[400px]"/>
        <section
          id="place_bid_bidprice"
          className="flex justify-between border-2 border-white border-solid w-5/6 max-w-[400px] items-center px-4 py-2 "
        >
          <p className="text-sm font-bold sm:text-lg">Bid Price:</p>
          <div className="relative flex items-center justify-center">
            <input
              type="number"
              min={0}
              className="bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
              value={bidPrice}
              onChange={(e) => setBidPrice(parseFloat(e.target.value))} />
            <Image
              src="/ETH.png"
              alt="Ethereum"
              width={24}
              height={24}
              className="absolute right-0" />
          </div>
        </section>
        <section
          id="place_bid_size"
          className="flex justify-between border-2 border-white border-solid w-5/6 max-w-[400px] items-center px-4 py-2"
        >
          <p className="text-sm font-bold sm:text-lg">Size:</p>
          <div className="relative flex">
            <button
              className="w-6 h-6 font-bold border-r-2 border-r-white"
              onClick={() => setSize((size) => (size > 1 ? --size : 1))}
            >
              -
            </button>
            <input
              type="text"
              placeholder="0"
              min={1}
              max={MAX_SIZE_ALLOWED}
              className="w-20 h-6 text-center bg-black outline-none shrink"
              value={size}
              onChange={(e) => {
                if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
                  setSize(1);
                } else if (parseInt(e.target.value) &&
                  parseInt(e.target.value) > MAX_SIZE_ALLOWED) {
                  setSize(MAX_SIZE_ALLOWED);
                } else {
                  setSize(parseInt(e.target.value));
                }
              }} />
            <button
              className="w-6 h-6 bg-black border-l-2 border-l-white"
              onClick={() => setSize((size) => size < MAX_SIZE_ALLOWED ? ++size : MAX_SIZE_ALLOWED
              )}
            >
              +
            </button>
          </div>
        </section>
        <ConstantLadderSelection
          id="place_bid_constantladder"
          popupType="placebids"
          styleClass="grid grid-cols-1 grid-rows-auto self-start gap-2 px-4 py-2 border-2 border-white border-solid w-5/6 max-w-[400px]" />
        <section
          id="place_bid_totalbids"
          className="flex justify-center w-5/6 max-w-[400px] items-center gap-x-1"
        >
          <p className="font-bold">Total Bid:</p>
          <p>{totalBid}
            <Image
              src="/ETH.png"
              alt="Ethereum"
              width={20}
              height={20}
              className="inline -translate-y-1" /></p>

        </section>
        <button
          id="place_bid_confirm_button"
          className="w-32 ezBtn ezBtnPrimary btn-md"
          onClick={handleApproveClick}
        >
          Confirm Bid
        </button>
      </div>
    </PopupBlurBackground>
  );
};


export default PopupPlaceBids;