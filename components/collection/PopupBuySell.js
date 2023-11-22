import { useEffect, useRef, useState } from "react";
import CollectionTitle from "./CollectionTitle";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import PopupBlurBackground from "./PopupBlurBackground";
import { useCollection } from "@/contexts/CollectionContext";

const PopupBuySell = () => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const { selectedNFTs, collectionName, popupWindow, selectNFTs } =
    useCollection();
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
        <CollectionTitle>{collectionName}</CollectionTitle>
        <NFTListView handleNFTClicked={handleNFTClicked} />
        <section
          id="NFT_Controller_Section"
          className="grid grid-rows-[1fr,1fr,1fr,1fr,3fr] grid-cols-[2fr,7fr] gap-y-1 max-h-full"
        >
          <NFTsSelectedRange radioRef={radioRef} />
          <p>Average Price: </p>
          <p>11 ETH</p>
          <p>Total Price: </p>
          <p>11 ETH</p>

          {popupWindow === "BUY" && (
            <button className="btn ezBtn ezBtnPrimaryOutline w-[150px] self-end">
              Confirm Buy
            </button>
          )}

          {popupWindow === "SELL" && (
            <button className="btn ezBtn ezBtnPrimaryOutline w-[150px] self-end">
              Approve NFTS
            </button>
          )}
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupBuySell;
