import { useState } from "react";

const ConstantLadderSelection = ({ styleGrid, popupType }) => {
  const [bidType, setBidType] = useState("CONSTANT");
  const [ladderType, setLadderType] = useState("PERCENT");
  const handleRadioChange = (e) => {
    setLadderType(e.target.value);
  };
  return (
    <div className={`${styleGrid} col-span-full w-full`}>
      <p>Set to:</p>
      <div className="flex justify-start items-start gap-x-2 md:gap-x-6 h-full">
        <button
          className={`btn ezBtn ezBtnPrimaryOutline w-[110px] md:btn-md 
          ${bidType === "CONSTANT" ? "glass" : ""} 
          `}
          onClick={() => setBidType("CONSTANT")}
        >
          Constant
        </button>
        <button
          className={`btn ezBtn ezBtnPrimaryOutline w-[110px] md:btn-md 
          ${bidType === "LADDER" ? "glass" : ""}
          `}
          onClick={() => setBidType("LADDER")}
        >
          Ladder
        </button>
      </div>
      {bidType === "LADDER" && (
        <div
          className={`flex justify-start items-center ${
            popupType === "deposit" ? "col-start-1" : "col-start-2"
          } md:col-start-2 gap-x-2 flex-wrap`}
        >
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
          <div>
            <input
              type="number"
              min={0}
              className="input input-bordered w-36 max-w-xs inline "
            />
            {ladderType === "PERCENT" ? (
              <span>%</span>
            ) : (
              <span className="text-base">ETH</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstantLadderSelection;
