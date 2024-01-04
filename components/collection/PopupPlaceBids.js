import Image from "next/image";
import BlurBackgroundForPopup from "./PopupBlurBackground";
import { useEffect, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { BuyPoolExp, SellPoolExp, TradePoolExp } from "../utils/calculate";
import { MaxFiveDecimal } from "../utils/roundoff";

const MAX_SIZE_ALLOWED = 10000;

const PopupPlaceBids = ({
  fromAddLiquidityPage = false,
  handleApproveClick,
}) => {
  const [size, setSize] = useState(1);
  const [totalBid, setTotalBid] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const {
    collectionName,
    floorPrice,
    topBid,
    constant_ladder,
    percent_linear,
    ladderValue,
  } = useCollection();

  useEffect(() => {
    let totalBid;

    if (constant_ladder === "CONSTANT") {
      totalBid = parseFloat(bidPrice * size).toFixed(4);
    } else if (constant_ladder === "LADDER") {
      if (percent_linear === "PERCENT") {
        totalBid =
          size <= MAX_SIZE_ALLOWED
            ? ladderPercentagePrice(bidPrice, size, ladderValue)
            : totalBid;
      } else if (percent_linear === "LINEAR") {
        totalBid =
          size <= MAX_SIZE_ALLOWED
            ? ladderLinearPrice(bidPrice, size, ladderValue)
            : totalBid;
      }
    }

    setTotalBid(parseFloat(totalBid).toFixed(MaxFiveDecimal(totalBid)));
  }, [bidPrice, size, constant_ladder, percent_linear, ladderValue]);

  function ladderPercentagePrice(
    initialPrice,
    numberOfItems,
    percentageDecrease
  ) {
    let totalBid = 0;

    for (let i = 0; i < numberOfItems; i++) {
      //make sure price cannot fall below 0 after decrease in percentage
      if (initialPrice * Math.pow(1 - percentageDecrease / 100, i) >= 0)
        totalBid += initialPrice * Math.pow(1 - percentageDecrease / 100, i);
    }

    return totalBid;
  }
  function ladderLinearPrice(initialPrice, numberOfItems, priceDecrease) {
    let totalBid = 0;

    for (let i = 0; i < numberOfItems; i++) {
      //make sure price cannot fall below 0 after decrease in linear price
      if (initialPrice - i * priceDecrease >= 0)
        totalBid += initialPrice - i * priceDecrease;
    }

    return totalBid;
  }

  return (
    <PopupBlurBackground>
      <div className="grid grid-cols-1 grid-rows-[2fr,7fr,3fr] w-full h-full text-base md:text-lg lg:text-xl">
        <CollectionTitle>
          {fromAddLiquidityPage ? "Add Liquidity for " : "Place bid on "}
          {collectionName}
          {fromAddLiquidityPage && (
            <span className="text-sm underline">Step 2: Add Tokens</span>
          )}
        </CollectionTitle>
        <section className="grid grid-cols-[3fr,6fr] grid-rows-[1fr,1fr,1fr,1fr,3fr] justify-items-start pt-10">
          <p>Floor Price:</p>
          <p>{floorPrice} ETH</p>

          <p>Top Bid:</p>
          <p>{topBid} ETH</p>

          <p>Bid Price:</p>
          <div className="relative flex items-center justify-center">
            <input
              type="number"
              min={0}
              placeholder="Amount"
              className="input input-bordered w-[160px] max-w-xs inline pr-[35px] text-sm"
              value={bidPrice}
              onChange={(e) => setBidPrice(parseFloat(e.target.value))}
            />
            <Image
              src="/ETH.png"
              alt="Ethereum"
              width={36}
              height={36}
              className="absolute right-0"
            />
          </div>

          {/* Daisy UI Input */}

          <p>Size:</p>
          <div className="relative flex items-stretch my-1">
            <button
              className="absolute left-0 border-0 rounded-none btn btn-square btn-success btn-outline btn-md"
              onClick={() => setSize((size) => (size > 1 ? --size : 1))}
            >
              -
            </button>
            <input
              type="text"
              placeholder="0"
              min={1}
              max={MAX_SIZE_ALLOWED}
              className="self-stretch w-full max-w-xs text-center bg-transparent input input-success border-x-0"
              value={size}
              onChange={(e) => {
                if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
                  console.log("aa");
                  setSize(1);
                } else if (
                  parseInt(e.target.value) &&
                  parseInt(e.target.value) > MAX_SIZE_ALLOWED
                ) {
                  console.log("here");
                  setSize(MAX_SIZE_ALLOWED);
                } else {
                  console.log("acc");
                  setSize(parseInt(e.target.value));
                }
              }}
            />
            <button
              className="absolute right-0 border-0 rounded-none btn btn-square btn-success btn-outline btn-md"
              onClick={() =>
                setSize((size) =>
                  size < MAX_SIZE_ALLOWED ? ++size : MAX_SIZE_ALLOWED
                )
              }
            >
              +
            </button>
          </div>
          <ConstantLadderSelection
            styleGrid="grid grid-cols-[3fr,6fr] grid-rows-[1fr,2fr]"
            popupType="placebids"
          />
        </section>
        <section className="grid grid-cols-[3fr,6fr] grid-rows-2 self-center ">
          <p>Total Bid:</p>
          <p>{totalBid} ETH</p>
          {fromAddLiquidityPage ? (
            <button
              className="w-full btn ezBtn ezBtnPrimaryOutline btn-md col-span-full"
              onClick={handleApproveClick}
            >
              Approve
            </button>
          ) : (
            <button className="w-full btn ezBtn ezBtnPrimaryOutline btn-md col-span-full">
              Confirm Bid
            </button>
          )}
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupPlaceBids;
