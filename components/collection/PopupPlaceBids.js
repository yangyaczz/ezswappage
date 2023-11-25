import Image from "next/image";
import BlurBackgroundForPopup from "./PopupBlurBackground";
import { useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";

const PopupPlaceBids = ({
  fromAddLiquidityPage = false,
  handleApproveClick,
}) => {
  const [size, setSize] = useState(1);
  const { collectionName } = useCollection();

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
          <p>11 ETH</p>

          <p>Top Bid:</p>
          <p>1 ETH</p>

          <p>Bid Price:</p>
          <div className="flex justify-center items-center relative">
            <input
              type="number"
              min={0}
              placeholder="Bid amount"
              className="input input-bordered w-[160px] max-w-xs inline pr-[35px] text-sm"
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
          <div className="flex items-stretch relative my-1">
            <button
              className="btn btn-square btn-success btn-outline btn-md rounded-none border-0 absolute left-0"
              onClick={() => setSize((size) => (size > 0 ? --size : 0))}
            >
              -
            </button>
            <input
              type="text"
              placeholder="0"
              className="input input-success w-full max-w-xs self-stretch text-center border-x-0 bg-transparent"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
            />
            <button
              className="btn btn-square btn-success btn-outline btn-md rounded-none border-0 absolute right-0"
              onClick={() => setSize((size) => ++size)}
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
          <p>11 ETH</p>
          {fromAddLiquidityPage ? (
            <button
              className="btn ezBtn ezBtnPrimaryOutline btn-md w-full col-span-full"
              onClick={handleApproveClick}
            >
              Approve
            </button>
          ) : (
            <button className="btn ezBtn ezBtnPrimaryOutline btn-md w-full col-span-full">
              Confirm Bid
            </button>
          )}
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupPlaceBids;
