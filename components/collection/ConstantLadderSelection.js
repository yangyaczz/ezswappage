import { useCollection } from "@/contexts/CollectionContext";
import { useState } from "react";

const ConstantLadderSelection = ({ styleGrid, popupType }) => {

  const {constant_ladder,percent_linear, setConstant_Ladder, setPercent_Linear, ladderValue, setLadderValue} = useCollection();
  const handleRadioChange = (e) => {
    setPercent_Linear(e.target.value);
  };
  return (
    <div className={`${styleGrid} col-span-full w-full`}>
      <p>Set to:</p>
      <div className="flex items-start justify-start h-full gap-x-2 md:gap-x-6">
        <button
          className={`btn ezBtn ezBtnPrimaryOutline w-[110px] md:btn-md 
          ${constant_ladder === "CONSTANT" ? "glass" : ""} 
          `}
          onClick={() => setConstant_Ladder("CONSTANT")}
        >
          Constant
        </button>
        <button
          className={`btn ezBtn ezBtnPrimaryOutline w-[110px] md:btn-md 
          ${constant_ladder === "LADDER" ? "glass" : ""}
          `}
          onClick={() => setConstant_Ladder("LADDER")}
        >
          Ladder
        </button>
      </div>
      {constant_ladder === "LADDER" && (
        <div
          className={`flex justify-start items-center ${
            popupType === "deposit" ? "col-start-1" : "col-start-2"
          } md:col-start-2 gap-x-2 flex-wrap`}
        >
          <div className="flex items-center justify-start">
            <div className="form-control">
              <label className="cursor-pointer label">
                <input
                  type="radio"
                  name="ladder-radio"
                  className="radio checked:bg-red-500"
                  value="PERCENT"
                  checked={percent_linear === "PERCENT"}
                  onChange={handleRadioChange}
                />
                <span className="label-text">Decrease by percent</span>
              </label>
            </div>
            <div className="form-control">
              <label className="cursor-pointer label">
                <input
                  type="radio"
                  name="ladder-radio"
                  className="radio checked:bg-red-500"
                  value="LINEAR"
                  checked={percent_linear === "LINEAR"}
                  onChange={handleRadioChange}
                />
                <span className="label-text">Decrease by linear</span>
              </label>
            </div>
          </div>
          <div>
            <input
              type="number"
              min={0}
              className="inline max-w-xs input input-bordered w-36 "
              value={ladderValue}
              onChange={(e)=>setLadderValue(e.target.value)}
            />
            {percent_linear === "PERCENT" ? (
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
