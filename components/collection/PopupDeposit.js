import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";

const PopupDeposit = ({ fromAddLiquidityPage = false, handleApproveClick }) => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs

  const { selectedNFTs, collectionName, selectNFTs } = useCollection();
  const radioRef = useRef(selectedNFTs.length);

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = selectedNFTs.length;
  }, [selectedNFTs]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId) {
    selectNFTs(tokenId);
  }

  return (
    <PopupBlurBackground>
      <div className="w-full h-full grid grid-cols-2 grid-rows-[1fr,6fr] gap-x-4">
        <CollectionTitle>
          {fromAddLiquidityPage && "Add Liquidity for "}
          {collectionName}
          {fromAddLiquidityPage && (
            <span className="text-sm underline">Step 1: Add NFTs</span>
          )}
        </CollectionTitle>
        <NFTListView handleNFTClicked={handleNFTClicked} />
        <section
          id="NFT_Controller_Section"
          className="grid grid-rows-[1fr,1fr,2fr,3fr,1fr,1fr] grid-cols-[2fr,7fr] gap-y-1 max-h-full"
        >
          <NFTsSelectedRange radioRef={radioRef} />
          <div className="flex justify-start items-start flex-wrap col-span-full gap-x-4">
            <p>Listing Price:</p>
            <div className="flex justify-center items-center relative">
              <input
                type="number"
                min={0}
                placeholder="Bid amount"
                className="input input-bordered w-[160px] max-w-xs inline pr-[35px] text-sm"
              />
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={36}
                height={36}
                className="absolute right-0"
              />
            </div>
            <p>Floor Price: 11 ETH</p>
          </div>
          <ConstantLadderSelection
            styleGrid="grid grid-cols-1 md:grid-cols-[2fr,7fr] grid-rows-[1fr,2fr]"
            popupType="deposit"
          />
          <p className="col-span-2">Average Price: 11ETH</p>
          <p className="col-span-2">Total Price: 11ETH</p>
          {fromAddLiquidityPage ? (
            <button
              className="btn ezBtn ezBtnPrimaryOutline btn-sm md:btn-md w-[110px]"
              onClick={handleApproveClick}
            >
              Approve
            </button>
          ) : (
            <button className="btn ezBtn ezBtnPrimaryOutline btn-sm md:btn-md w-[110px] ">
              Confirm
            </button>
          )}
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupDeposit;
