import Image from "next/image";
import BlurBackgroundForPopup from "./BlurBackgroundForPopup";
import { useState } from "react";

const style = {};

const PlaceBidsPopup = ({
  collectionName = "Bored Ape Yacht Club",
  setPopupOpen,
}) => {
  const [size, setSize] = useState(1);
  const [bidType, setBidType] = useState("CONSTANT");
  const [ladderType, setLadderType] = useState("PERCENT");

  const handleRadioChange = (e) => {
    setLadderType(e.target.value);
  };

  return (
    <BlurBackgroundForPopup setPopupOpen={setPopupOpen}>
      <div
        className="grid grid-cols-1 grid-rows-[3] w-full h-full text-base md:text-lg lg:text-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl justify-self-start place-self-center ">
          Place bid on {collectionName}
        </h1>
        <section className="grid grid-cols-[3fr,6fr] justify-items-start items-center auto-rows-auto">
          <p>Floor Price:</p>
          <p>11 ETH</p>

          <p>Top Bid:</p>
          <p>1 ETH</p>

          <p>Bid Price:</p>
          <div className="flex justify-center items-center">
            <input
              type="number"
              min={0}
              placeholder="Bid amount"
              className="input input-bordered w-full max-w-xs inline pr-[45px]"
            />
            <Image
              src="/ETH.png"
              alt="Ethereum"
              width={50}
              height={50}
              className="-translate-x-10"
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
          <p>Set to:</p>
          <div className="flex justify-start items-center gap-x-6 h-full">
            <button
              className={`btn btn-success btn-outline btn-sm md:btn-md w-[110px] ${
                bidType === "CONSTANT" ? "glass" : ""
              }`}
              onClick={() => setBidType("CONSTANT")}
            >
              Constant
            </button>
            <button
              className={`btn btn-success btn-outline btn-sm md:btn-md w-[110px] ${
                bidType === "LADDER" ? "glass" : ""
              }`}
              onClick={() => setBidType("LADDER")}
            >
              Ladder
            </button>
          </div>
          {bidType === "LADDER" && (
            <div className="flex justify-center items-center col-start-2 gap-x-2">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <input
                    type="radio"
                    name="ladder-radio"
                    class="radio checked:bg-red-500"
                    value="PERCENT"
                    checked={ladderType === "PERCENT"}
                    onChange={handleRadioChange}
                  />
                  <span class="label-text">Decrease by percent</span>
                </label>
              </div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <input
                    type="radio"
                    name="ladder-radio"
                    class="radio checked:bg-red-500"
                    value="LINEAR"
                    checked={ladderType === "LINEAR"}
                    onChange={handleRadioChange}
                  />
                  <span class="label-text">Decrease by linear</span>
                </label>
              </div>
              <input
                type="number"
                min={0}
                className="input input-bordered w-32 max-w-xs inline "
              />
              {ladderType === "PERCENT" ? <span>%</span> : <span>ETH</span>}
            </div>
          )}
        </section>
        <section className="grid grid-cols-[3fr,6fr] grid-rows-2 self-center ">
          <p>Total Bid:</p>
          <p>11 ETH</p>
          <button className="btn btn-success btn-outline btn-md w-full col-span-full">
            Confirm Bid
          </button>
        </section>
      </div>
    </BlurBackgroundForPopup>
  );
};

export default PlaceBidsPopup;
