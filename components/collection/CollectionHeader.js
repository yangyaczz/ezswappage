import Image from "next/image";
import addressIcon from "../../pages/data/address_icon.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useRef } from "react";

const CollectionHeader = ({
  address,
  name,
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
  const tooltipRef = useRef("");
  return (
    <section className="grid gap-4 grid-cols-[90px,auto] grid-rows-1">
      <Image
        width={COLLECTION_PIC_SIZE}
        height={COLLECTION_PIC_SIZE}
        src={img}
        alt={name}
      />
      <div className="flex flex-col justify-start items-start gap-y-4 flex-wrap">
        <header className="flex justify-start items-baseline w-full gap-x-8 leading-4  max-w-lg">
          <p className="text-md md:text-lg lg:text-2xl whitespace-nowrap">
            <span className="font-bold mx-1">
              {name}
              {currencyImage && (
                <Image
                  src={currencyImage.src}
                  alt={currencyImage.label}
                  width={28}
                  height={28}
                  className="inline mx-1 align-baseline"
                />
              )}
            </span>
            <span className="text-sm align-baseline mx-3">
              vol: {totalVolume} {tradingCurrencyName}
            </span>
          </p>

          <div className="grow flex items-center justify-end gap-x-2 ">
            <div
              className="flex items-center gap-x-2  bg-[rgba(82,82,91,0.8)] opacity-80 px-3 py-[0.1rem] rounded-md cursor-pointer hover:bg-[rgba(63,63,70,0.8)] hover:text-white tooltip tooltip-top"
              data-tip={"copy address"}
              ref={tooltipRef}
              onMouseEnter={() => {
                tooltipRef.current.setAttribute("data-tip", "copy address");
              }}
              onClick={() => {
                navigator.clipboard.writeText(address);
                tooltipRef.current.setAttribute("data-tip", "copied");
              }}
            >
              <FontAwesomeIcon icon={faCopy} size="xs" />
              <label className="text-xs text-end self-end cursor-pointer align-baseline">{`${address.substring(
                0,
                5
              )}......${address.substring(address.length - 4)}`}</label>
            </div>
          </div>

          {/* <p className="text-sm lg:text-base">Estimated APR: 20%</p> */}
        </header>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 lg:grid-cols-4-auto lg:grid-rows-1 gap-x-4">
          <p className="text-sm xl:text-base">
            Floor Price:{" "}
            <span>
              {floorPrice} {tradingCurrencyName}
            </span>
          </p>
          <p className="text-sm xl:text-base">
            NFT Amount: <span>{nftAmount}</span>
          </p>
          <p className="text-sm xl:text-base">
            Top Bid:{" "}
            <span>
              {topBid} {tradingCurrencyName}
            </span>
          </p>
          <p className="text-sm xl:text-base">
            Offer TVL:{" "}
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
