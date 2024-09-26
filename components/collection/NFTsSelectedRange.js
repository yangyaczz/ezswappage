import { useCollection } from "@/contexts/CollectionContext";
import { useEffect, useState } from "react";

const NFTsSelectedRange = ({ radioRef, styleClass }) => {
  const {
    tokenId1155,
    selected1155NFTAmount,
    selectedNFTs,
    NFTList,
    changeRangeValue,
  } = useCollection();
  // const [numVal, setNumVal] = useState(0);

  // useEffect(() => {
  //   console.log('aaaa', selectedNFTs.length,selected1155NFTAmount,NFTList.length)
  //   if (selectedNFTs.length > NFTList.length || selected1155NFTAmount > NFTList.length){
  //     setNumVal(NFTList.length)
  //   }else {
  //     setNumVal(tokenId1155 ? isNaN(selected1155NFTAmount)?0 :selected1155NFTAmount : selectedNFTs.length);
  //   }
  // }, [radioRef, selectedNFTs.length,selected1155NFTAmount]);

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  function handleRangeChange(e) {
    const numOfNFTByRange = parseInt(
      e.target.value === ""
        ? 0
        : e.target.value > NFTList.length
        ? NFTList.length
        : e.target.value
    );
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
      {/*<input*/}
      {/*    type="number"*/}
      {/*    min={0}*/}
      {/*    value = {numVal}*/}
      {/*    onChange={handleRangeChange}*/}
      {/*    className="text-base text-right bg-black border-l-2 rounded-none border-l-solid w-11 sm:text-base lg:text-base"*/}
      {/*/>*/}
      <input
        type="text"
        min={0}
        max={NFTList.length}
        value={tokenId1155 ? selected1155NFTAmount : selectedNFTs.length}
        onChange={handleRangeChange}
        className="mr-1 text-base text-center bg-black border-l-2 outline-none w-11 sm:text-base lg:text-base border-l-solid"
      >
        
      </input>
    </div>
  );
};

export default NFTsSelectedRange;
