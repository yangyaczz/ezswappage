import Image from "next/image";
import addressIcon from "../../pages/data/address_icon.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const CollectionHeader = ({
  address,
  name,
  type,
  tokenId1155,
  img,
  COLLECTION_PIC_SIZE,
  floorPrice,
  topBid,
  nftAmount,
  offerTVL,
  tradingCurrencyName,
  currencyImage,
  totalVolume,
}) => {
  const {languageModel} = useLanguage();
  const tooltipRef = useRef("");
  return (
    <section className="grid gap-4 grid-cols-1 grid-rows-[65px,auto] sm:grid-rows-[65px,auto] sm:grid-cols-[90px,auto] md:grid-rows-1">
      {/* <Image
        width={30}
        height={30}
        src={img}
        alt={name}
      /> */}
      <img src={img} alt={name} className="w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] md:w-[90px] md:h-[90px] "/>
      <div className="flex flex-col items-start justify-start gap-y-4">
        <header className="flex flex-wrap items-baseline justify-start max-w-lg min-w-full gap-0 leading-4">
          <p className="flex items-baseline mx-1 font-bold text-md md:text-lg lg:text-2xl whitespace-nowrap">
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
          <p className="mx-1 text-sm align-baseline md:mx-3 ">
              {languageModel.Vol}: {totalVolume} {tradingCurrencyName}
          </p>

          <div className="flex items-center justify-start mx-1 md:mx-0 grow gap-x-2 ">
            <div
              className="flex items-center gap-x-2  bg-[rgba(82,82,91,0.8)] opacity-80 px-3 py-[0.1rem] rounded-md cursor-pointer hover:bg-[rgba(63,63,70,0.8)] hover:text-white tooltip tooltip-top"
              data-tip={languageModel.copyAddress}
              ref={tooltipRef}
              onMouseEnter={() => {
                tooltipRef.current.setAttribute("data-tip", languageModel.copyAddress);
              }}
              onClick={() => {
                navigator.clipboard.writeText(address);
                tooltipRef.current.setAttribute("data-tip", languageModel.Copied);
              }}
            >
              <FontAwesomeIcon icon={faCopy} size="xs" />
              <label className="self-end text-xs align-baseline cursor-pointer text-end">{`${address.substring(
                0,
                5
              )}......${address.substring(address.length - 4)}`}</label>
            </div>
          </div>

          {/* <p className="text-sm lg:text-base">Estimated APR: 20%</p> */}
        </header>
        <div className="grid grid-cols-2 gap-2 md:grid-rows-2 md:gap-4 lg:grid-cols-4-auto lg:grid-rows-1 gap-x-4">
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
