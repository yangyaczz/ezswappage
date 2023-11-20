import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";

const { default: BlurBackgroundForPopup } = require("./BlurBackgroundForPopup");

const DepositPopup = ({
  collectionName = "Bored Ape Yacht Club",
  setPopupOpen,
  fromAddLiquidityPage = false,
  handleApproveClick,
}) => {
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
  const [bidType, setBidType] = useState("CONSTANT");
  const radioRef = useRef(selectedNFTs.length);

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
    <BlurBackgroundForPopup setPopupOpen={setPopupOpen}>
      <div className="w-full h-full grid grid-cols-2 grid-rows-[1fr,6fr]">
        <h1 className="text-xl sm:text-2xl lg:text-3xl justify-self-start place-self-center col-span-full w-full flex justify-between items-center flex-wrap">
          {fromAddLiquidityPage && "Add Liquidity for "}
          {collectionName}
          {fromAddLiquidityPage && (
            <span className="text-sm underline">Step 1: Add NFTs</span>
          )}
        </h1>
        <section
          id="NFTs_View_Section"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2 pr-4 py-1 overflow-auto"
        >
          {NFTList.map((NFT) => (
            <div
              key={NFT.tokenId}
              className="w-full flex flex-col justify-center items-center cursor-pointer hover:ring-2 hover:ring-offset-4"
              onClick={() => handleNFTClicked(NFT.tokenId)}
            >
              <div className="max-w-[220px] w-full relative flex items-center justify-center">
                <Image
                  src={NFT.imgUrl}
                  alt={NFT.tokenId}
                  width={220}
                  height={220}
                />
                <p className="absolute top-0 left-0">{NFT.tokenId}</p>
                <div className="form-control absolute top-0 right-0">
                  <input
                    type="checkbox"
                    checked={selectedNFTs.includes(NFT.tokenId)}
                    onChange={() => handleNFTClicked(NFT.tokenId)}
                    className="checkbox checkbox-primary"
                  />
                </div>
              </div>

              <p className="max-w-[220px] w-full text-center bg-zinc-700 z-10">
                {NFT.bidPrice} ETH
              </p>
            </div>
          ))}
        </section>
        <section
          id="NFT_Controller_Section"
          className="grid grid-rows-[1fr,1fr,2fr,3fr,1fr,1fr] grid-cols-[2fr,7fr] gap-y-1 max-h-full"
        >
          <p className="text-lg sm:text-xl lg:text-2xl col-span-full">
            {selectedNFTs.length} / {NFTList.length} Selected
          </p>
          <input
            type="range"
            min={0}
            max={NFTList.length}
            // value={selectedNFTs.length}
            ref={radioRef}
            onChange={handleRangeChange}
            className="range range-primary col-span-full"
          />
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
            bidType={bidType}
            setBidType={setBidType}
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
    </BlurBackgroundForPopup>
  );
};

export default DepositPopup;
