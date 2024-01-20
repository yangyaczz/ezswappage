import { useCollection } from "@/contexts/CollectionContext";

const NFTsSelectedRange = ({ radioRef, styleClass }) => {
  const { selectedNFTs, NFTList, changeRangeValue } = useCollection();

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  function handleRangeChange(e) {
    const numOfNFTByRange = parseInt(e.target.value);
    changeRangeValue(numOfNFTByRange);
  }

  return (
    <div className={`flex gap-2 items-center ${styleClass} `}>
      <input
        type="range"
        min={0}
        max={NFTList.length}
        ref={radioRef}
        onChange={handleRangeChange}
        className="range range-primary range-xs"
      />
      <p className="text-lg text-center border-l-2 w-11 sm:text-xl lg:text-2xl border-l-solid">
        {selectedNFTs.length}
      </p>
    </div>
  );
};

export default NFTsSelectedRange;
