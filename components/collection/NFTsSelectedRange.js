import { useCollection } from "@/contexts/CollectionContext";
import {useEffect, useState} from "react";

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
    //   console.log('e.target.value', e.target.value,NFTList.length)
    // if (e.target.value > NFTList.length){
    //   setNumVal(NFTList.length)
    // }else {
    //   setNumVal(e.target.value)
    // }
    const numOfNFTByRange = parseInt(e.target.value === '' ? 0:e.target.value>NFTList.length?NFTList.length:e.target.value);
    console.log('numOfNFTByRange', numOfNFTByRange)
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
        {/*    className="border-l-solid text-base text-right border-l-2 w-11 sm:text-base lg:text-base bg-black rounded-none"*/}
        {/*/>*/}
      <p className="text-base text-right border-l-2 w-11 sm:text-base lg:text-base border-l-solid mr-1">
        {tokenId1155 ? selected1155NFTAmount : selectedNFTs.length}
      </p>
    </div>
  );
};

export default NFTsSelectedRange;
