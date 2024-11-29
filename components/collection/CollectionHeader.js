import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useLanguage } from "@/contexts/LanguageContext";

const CollectionHeader = ({
  contractAddress,
  name,
  type,
  tokenId1155,
  img,
  COLLECTION_PIC_SIZE,
  floorPrice,
  topBid,
  nftAmount,
  offerTVL,
  currencyImage,
  tradingCurrencyName,
  totalVolume,
                            jumpInfo
}) => {
  const { languageModel } = useLanguage();
  return (
    <section className="grid gap-x-2 md:gap-4 grid-rows-1 grid-cols-[65px,auto] sm:grid-cols-[120px,auto] cursor-pointer" onClick={jumpInfo}>
      {/* <Image
        width={129}
        height={129}
        src={img}
        alt={name}
      /> */}
      <img
        src={img}
        alt={name}
        className="w-[65px] h-[65px] sm:w-[120px] sm:h-[120px]"
      />
      <div className="flex flex-col items-center justify-center gap-y-9">
        <header className="flex flex-col flex-wrap items-baseline justify-start max-w-lg min-w-full leading-4 gap-x-4 sm:flex-row">
          <p className="flex items-baseline text-xl font-bold text-white lg:text-2xl whitespace-nowrap">
            {name}
            {/*{type==="ERC1155" && <span className="text-base"> token {tokenId1155}</span>}*/}
            {currencyImage && (
              <Image
                src={currencyImage.src}
                alt={currencyImage.label}
                width={28}
                height={28}
                className="inline mx-1 align-baseline"
              />
            )}
          </p>
          <p className="text-sm text-white align-baseline xl:text-base whitespace-nowrap ">
            {languageModel.Vol.toUpperCase()}: {totalVolume} {tradingCurrencyName}
          </p>
          {/* <p className="text-sm lg:text-base">Estimated APR: 20%</p> */}


        </header>

        <div className="text-white grid self-stretch grid-cols-1 gap-2 place-items-start sm:grid-cols-2 sm:grid-rows-2 md:gap-4 lg:grid-cols-[3fr,2fr,3fr,3fr] lg:grid-rows-1 gap-x-4 whitespace-nowrap">
          <p className="text-sm xl:text-base">
            {languageModel.FloorPrice}:{" "}
            <span>
              {floorPrice} {tradingCurrencyName}
            </span>
          </p>
          <p className="text-sm xl:text-base">
            {languageModel.NFTAmount}: <span>{nftAmount}</span>
          </p>
          <p className="text-sm xl:text-base">
            {languageModel.TopBid}:{" "}
            <span>
              {topBid} {tradingCurrencyName}
            </span>
          </p>
          <p className="text-sm xl:text-base">
            {languageModel.OfferTVL}:{" "}
            <span>
              {offerTVL} {tradingCurrencyName}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionHeader;
