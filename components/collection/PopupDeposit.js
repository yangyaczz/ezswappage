import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ConstantLadderSelection from "./ConstantLadderSelection";
import PopupBlurBackground from "./PopupBlurBackground";
import NFTListView from "./NFTListView";
import NFTsSelectedRange from "./NFTsSelectedRange";
import CollectionTitle from "./CollectionTitle";
import { useCollection } from "@/contexts/CollectionContext";
import { MaxFiveDecimal } from "../utils/roundoff";
import {
  ladderPercentagePrice,
  ladderLinearPrice,
  constantPrice,
} from "../utils/collectionUtils";
import PopupHeader from "./PopupHeader";

const PopupDeposit = ({ handleApproveClick = () => {} }) => {
  // const [selectedNFTs, setSelectedNFTs] = useState([]); //Take down selected / checked NFTs
  const MAX_SIZE_ALLOWED = 10000;
  const {
    selectedNFTs,
    selected1155NFTAmount,
    tokenId1155,
    selectNFTs,
    constant_ladder,
    percent_linear,
    ladderValue,
    setNFTListviewPrices,
    currencyImage,
    NFTList,
  } = useCollection();
  const radioRef = useRef(
    tokenId1155 ? selected1155NFTAmount : selectedNFTs.length
  );
  const [listingPrice, setListingPrice] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  //change the value of radio bar whenever selected nfts changed
  useEffect(() => {
    radioRef.current.value = tokenId1155
      ? selected1155NFTAmount
      : selectedNFTs.length;
  }, [selectedNFTs, selected1155NFTAmount, tokenId1155]);

  //put on and take away checkbox when the entire div of a NFT is clicked
  function handleNFTClicked(tokenId, _index) {
    selectNFTs(tokenId, _index);
  }

  useEffect(() => {
    function calculatePrices() {
      let totalListPrice = 0,
        avgPrice = 0,
        priceList = [];

      let NFTAmount = tokenId1155 ? selected1155NFTAmount : selectedNFTs.length;

      if (constant_ladder === "CONSTANT") {
        ({ totalPrice: totalListPrice, priceList } = constantPrice(
          listingPrice,
          NFTAmount
        ));
      } else if (constant_ladder === "LADDER") {
        if (percent_linear === "PERCENT") {
          ({ totalPrice: totalListPrice, priceList } =
            NFTAmount <= MAX_SIZE_ALLOWED
              ? ladderPercentagePrice(listingPrice, NFTAmount, ladderValue)
              : { totalListPrice, priceList });
        } else if (percent_linear === "LINEAR") {
          ({ totalPrice: totalListPrice, priceList } =
            NFTAmount <= MAX_SIZE_ALLOWED
              ? ladderLinearPrice(listingPrice, NFTAmount, ladderValue)
              : { totalListPrice, priceList });
        }
      }
      totalListPrice = !totalListPrice ? 0 : totalListPrice;
      avgPrice = parseFloat(totalListPrice) / NFTAmount;
      avgPrice = !avgPrice ? 0 : avgPrice;
      setTotalPrice(
        parseFloat(totalListPrice).toFixed(MaxFiveDecimal(totalListPrice))
      );
      setAvgPrice(parseFloat(avgPrice).toFixed(MaxFiveDecimal(avgPrice)));
      setNFTListviewPrices(priceList);
    }

    calculatePrices();
  }, [
    listingPrice,
    selectedNFTs.length,
    selected1155NFTAmount,
    constant_ladder,
    percent_linear,
    ladderValue,
  ]);

  return (
    <PopupBlurBackground>
      <div className="grid items-center w-full h-full grid-cols-2 text-sm text-white content-stretch gap-x-4 justify-items-center md:text-base lg:text-lg">
        <NFTListView
          handleNFTClicked={handleNFTClicked}
          styleClass="p-4 border-2 border-white border-solid w-full max-w-[400px] h-full"
        />
        <section
          id="NFT_Controller_Section"
          className="grid grid-cols-1 grid-rows-[2fr,auto,auto,3fr,auto,auto,auto] gap-y-2 justify-items-center h-full "
        >
          <PopupHeader
            handlePriceClick={(price) => setListingPrice(price)}
            styleClass="px-4 py-1 border-2 border-white border-solid w-full max-w-[400px] content-center"
          />
          <NFTsSelectedRange
            radioRef={radioRef}
            styleClass="px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]"
          />
          <section
            id="list_nft_price"
            className="flex items-center justify-between border-2 border-white border-solid w-full max-w-[400px] px-4 py-1 "
          >
            <p className="text-sm font-bold sm:text-base lg:text-lg ">
              Listing Price:
            </p>
            <div className="relative flex items-center justify-center">
              <input
                type="number"
                min={0}
                placeholder="Amount"
                className="bg-black w-[106px] inline pr-[26px] pl-1 outline-0 border-l-2 border-l-white text-base"
                value={listingPrice}
                onChange={(e) => setListingPrice(parseFloat(e.target.value))}
              />
              <Image
                src={currencyImage?.src}
                alt={currencyImage?.label}
                width={24}
                height={24}
                className="absolute right-0"
              />
            </div>
          </section>
          <ConstantLadderSelection
            popupType="deposit"
            styleClass="grid grid-cols-1 grid-rows-auto self-start gap-2 px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]"
          />
          <div className="flex justify-between px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]">
            <label>Average Price:</label>
            <p>
              {avgPrice}
              <Image
                src={currencyImage?.src}
                alt={currencyImage?.label}
                width={20}
                height={20}
                className="inline -translate-y-1"
              />
            </p>
          </div>
          <div className="flex justify-between px-4 py-1 border-2 border-white border-solid w-full max-w-[400px]">
            <label>Total Price:</label>
            <p>
              {totalPrice}
              <Image
                src={currencyImage?.src}
                alt={currencyImage?.label}
                width={20}
                height={20}
                className="inline -translate-y-1"
              />
            </p>
          </div>
          <button
            className={`btn ezBtn ezBtnPrimary btn-sm w-36  ${
              NFTList && NFTList.length > 0 ? "" : "!bg-zinc-500"
            }`}
            onClick={handleApproveClick}
            disabled={NFTList.length > 0 ? false : true}
          >
            Confirm
          </button>
        </section>
      </div>
    </PopupBlurBackground>
  );
};

export default PopupDeposit;
