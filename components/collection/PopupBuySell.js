import { useEffect, useRef, useState } from "react";
import CollectionTitle from "./CollectionTitle";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import PopupBlurBackground from "./PopupBlurBackground";
import { useCollection } from "@/contexts/CollectionContext";

const PopupBuySell = () => {
  const NFTs = [
    { tokenId: 1123, imgUrl: "/bayc.jpg", bidPrice: "99" },
    { tokenId: 1143, imgUrl: "/bayc.jpg", bidPrice: "89" },
    { tokenId: 1126, imgUrl: "/bayc.jpg", bidPrice: "42" },
    { tokenId: 1823, imgUrl: "/bayc.jpg", bidPrice: "47" },
    { tokenId: 1833, imgUrl: "/bayc.jpg", bidPrice: "47" },
    { tokenId: 1863, imgUrl: "/bayc.jpg", bidPrice: "47" },
    { tokenId: 1213, imgUrl: "/bayc.jpg", bidPrice: "47" },
    // { tokenId: 13, imgUrl: "/bayc.jpg", bidPrice: "47" },
    // { tokenId: 123, imgUrl: "/bayc.jpg", bidPrice: "47" },
  ];
  const [NFTList, setNFTList] = useState(NFTs);
  const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const radioRef = useRef(selectedNFTs.length);
  const { collectionName, popupWindow } = useCollection();

  //sort the NFT list by tokenId on page load
  useEffect(() => {
    setNFTList((NFTList) =>
      NFTList.slice().sort((a, b) => a.tokenId - b.tokenId)
    );
    radioRef.current.value = 0;
  }, []);

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = selectedNFTs.length;
  }, [selectedNFTs]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId) {
    selectedNFTs.includes(tokenId)
      ? setSelectedNFTs((NFTs) => NFTs.filter((nftId) => nftId !== tokenId))
      : setSelectedNFTs((NFTs) => [...NFTs, tokenId]);
  }

  //increase or decrease NFTs checkbox when the radio bar in being dragged
  function handleRangeChange(e) {
    const numOfNFTByRange = parseInt(e.target.value);
    if (selectedNFTs.length === numOfNFTByRange) return;
    //when the user drags the range bar to increase the number (by 1) of NFTs, we are going to add the first "unchecked" NFTs in NFTList array to the selectedNFTs array
    if (selectedNFTs.length < numOfNFTByRange)
      setSelectedNFTs((NFTs) => [
        ...NFTs,
        NFTList.find((nft) => !NFTs.includes(nft.tokenId)).tokenId,
      ]);
    else if (selectedNFTs.length > numOfNFTByRange) {
      //gets the last selected nft tokenId from the view section
      const lastNFT = NFTList.slice()
        .reverse()
        .find((nftL) => selectedNFTs.includes(nftL.tokenId)).tokenId;

      //and remove the last selected nft from the selectedNfts array by its tokenId
      setSelectedNFTs((NFTs) => NFTs.filter((nft) => nft !== lastNFT));
    }
  }

  return (
    <PopupBlurBackground>
      <div className="w-full h-full grid grid-cols-2 grid-rows-[1fr,6fr] gap-x-4">
        <CollectionTitle>{collectionName}</CollectionTitle>
        <NFTListView
          selectedNFTs={selectedNFTs}
          NFTList={NFTList}
          handleNFTClicked={handleNFTClicked}
        />
        <section
          id="NFT_Controller_Section"
          className="grid grid-rows-[1fr,1fr,1fr,1fr,3fr] grid-cols-[2fr,7fr] gap-y-1 max-h-full"
        >
          <NFTsSelectedRange
            selectedNFTLength={selectedNFTs.length}
            NFTListLength={NFTList.length}
            radioRef={radioRef}
            handleRangeChange={handleRangeChange}
          />
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
