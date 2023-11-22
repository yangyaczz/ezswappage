import { useCollection } from "@/contexts/CollectionContext";

const NFTsSelectedRange = ({ radioRef }) => {
  const { selectedNFTs, NFTList, changeRangeValue } = useCollection();

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  function handleRangeChange(e) {
    const numOfNFTByRange = parseInt(e.target.value);
    changeRangeValue(numOfNFTByRange);
  }

  return (
    <>
      <p className="text-lg sm:text-xl lg:text-2xl col-span-full">
        {selectedNFTs.length} / {NFTList.length} Selected
      </p>
      <input
        type="range"
        min={0}
        max={NFTList.length}
        ref={radioRef}
        onChange={handleRangeChange}
        className="range range-primary col-span-full"
      />
    </>
  );
};

export default NFTsSelectedRange;
