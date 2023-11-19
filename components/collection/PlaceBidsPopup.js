import Image from "next/image";
import BlurBackgroundForPopup from "./BlurBackgroundForPopup";
import { useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";

const PlaceBidsPopup = ({
  collectionName = "Bored Ape Yacht Club",
  setPopupOpen,
}) => {
  const [size, setSize] = useState(1);
  const [bidType, setBidType] = useState("CONSTANT");

  return (
    <BlurBackgroundForPopup setPopupOpen={setPopupOpen}>
      <div className="grid grid-cols-1 grid-rows-[2fr,7fr,3fr] w-full h-full text-base md:text-lg lg:text-xl">
        <h1 className="text-xl sm:text-2xl lg:text-3xl justify-self-start place-self-center ">
          Place bid on {collectionName}
        </h1>
        <section className="grid grid-cols-[3fr,6fr] justify-items-start items-center auto-rows-auto">
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
          <div className="flex items-stretch relative">
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
            bidType={bidType}
            setBidType={setBidType}
            styleGrid="grid grid-cols-[3fr,6fr] auto-rows-auto"
            popupType="placebids"
          />
        </section>
        <section className="grid grid-cols-[3fr,6fr] grid-rows-2 self-center ">
          <p>Total Bid:</p>
          <p>11 ETH</p>
          <button className="btn ezBtn ezBtnPrimaryOutline btn-md w-full col-span-full">
            Confirm Bid
          </button>
        </section>
      </div>
    </BlurBackgroundForPopup>
  );
};

export default PlaceBidsPopup;
