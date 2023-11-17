import { useState } from "react";

const ConstantLadderSelection = ({ bidType, setBidType, styleGridCol }) => {
  const [ladderType, setLadderType] = useState("PERCENT");
  const handleRadioChange = (e) => {
    setLadderType(e.target.value);
  };
  return (
    <div className={`grid ${styleGridCol} auto-rows-auto col-span-full w-full`}>
      <p>Set to:</p>
      <div className="flex justify-start items-start gap-x-6 h-full">
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
        <div className="flex justify-start items-center col-start-2 gap-x-2 flex-wrap">
          <div className="flex justify-start items-center">
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
          </div>
          <input
            type="number"
            min={0}
            className="input input-bordered w-36 max-w-xs inline "
          />
          {ladderType === "PERCENT" ? <span>%</span> : <span>ETH</span>}
        </div>
      )}
    </div>
  );
};

export default ConstantLadderSelection;
