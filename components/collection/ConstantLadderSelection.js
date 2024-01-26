import { useCollection } from "@/contexts/CollectionContext";
import {useEffect} from "react";

const ConstantLadderSelection = ({ popupType, styleClass }) => {
  const {
    constant_ladder,
    percent_linear,
    setConstant_Ladder,
    setPercent_Linear,
    ladderValue,
    setLadderValue,
    currencyImage
  } = useCollection();

  useEffect(() => {
    // console.log('ConstantLadderSelection ladderValue', ladderValue)
    if (percent_linear === 'PERCENT' && ladderValue<=0) {
      setLadderValue(0.01);
    }else if (percent_linear === 'LINEAR' && ladderValue<=0){
      setLadderValue(0);
    }
  });
  const handleRadioChange = (e) => {
    setPercent_Linear(e.target.value);
  };
  return (
    <div className={`${styleClass}`}>
      <p className="text-sm font-bold sm:text-lg">Set to:</p>
      <div className="flex items-start justify-between h-full gap-x-2">
        <button
          className={`ezBtn btn-sm w-1/2 max-w-[160px]
          ${
            constant_ladder === "CONSTANT"
              ? "ezBtnPrimary"
              : "ezBtnPrimaryOutline"
          } 
          `}
          onClick={() => setConstant_Ladder("CONSTANT")}
        >
          Constant
        </button>
        <button
          className={`ezBtn btn-sm w-1/2 max-w-[160px]
          ${
            constant_ladder === "LADDER"
              ? "ezBtnPrimary"
              : "ezBtnPrimaryOutline"
          }
          `}
          onClick={() => setConstant_Ladder("LADDER")}
        >
          Ladder
        </button>
      </div>
      {constant_ladder === "LADDER" && (
        <div className={`grid grid-cols-[3fr,2fr] justify-items-stretch place-items-center`}>
          <div id="percent_linear" className="flex flex-col items-start justify-start">
            <div>
              <label className="justify-start cursor-pointer label">
                <input type="radio" name="ladder-radio" className="radio checked:bg-neutral-100" value="PERCENT"
                  checked={percent_linear === "PERCENT"} onChange={handleRadioChange}/>
                <span className="text-xs md:text-sm label-text text-zinc-200 ml-2">Change by percent</span>
              </label>
            </div>
            <div>
              <label className="justify-start cursor-pointer label">
                <input type="radio" name="ladder-radio" className="radio checked:bg-neutral-100" value="LINEAR"
                  checked={percent_linear === "LINEAR"} onChange={handleRadioChange}/>
                <span className="text-xs md:text-sm label-text text-zinc-200 ml-2">Change by linear</span>
              </label>
            </div>
          </div>
          <div id="ladder_input" className="flex items-center justify-center w-32 px-2 py-2 border-2 border-zinc-200 border-solid h-[60px] rounded-md">
            <input type="number" min={0} className="self-stretch w-20 bg-black outline-none" value={ladderValue} onChange={(e) => setLadderValue(e.target.value)}/>
            {percent_linear === "PERCENT" ? (
              <span className="text-xs">%</span>
            ) : (
              <span className="text-xs">{currencyImage.label}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstantLadderSelection;
