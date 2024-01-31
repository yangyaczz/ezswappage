import { useCollection } from "@/contexts/CollectionContext";

const NFTsSelectedRange = ({ radioRef, styleClass }) => {
  const {
    tokenId1155,
    selected1155NFTAmount,
    selectedNFTs,
    NFTList,
    changeRangeValue,
  } = useCollection();

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
      <p className="text-base text-right border-l-2 w-11 sm:text-base lg:text-base border-l-solid mr-1">
        {tokenId1155 ? selected1155NFTAmount : selectedNFTs.length}
      </p>
    </div>
  );
};

export default NFTsSelectedRange;
