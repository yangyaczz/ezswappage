import Image from "next/image";
import InfoBox from "./InfoBox";
import { useEffect } from "react";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";

const CollectionInfoHeader = () => {
  const { colInfo } = useCollectionInfo();

  useEffect(() => {}, []);

  return (
    <div className="w-full max-w-[1200px] h-[150px] sm:h-[210px] grid grid-cols-[150px,auto] sm:grid-cols-[210px,auto] grid-rows-3 gap-4 sm:gap-8">
      <div className="w-full relative pt-[100%]">
        <Image
          objectFit="cover"
          fill
          className="top-0 inline object-cover w-full h-full left-0s"
          src={colInfo.image}
          alt={colInfo.name}
        />
      </div>
      <h1 className="col-start-2 text-5xl font-bold text-white">
        {colInfo.name}
      </h1>
      <section
        id="volume_section"
        className="flex items-end col-start-2 row-span-2 gap-2 sm:gap-4 justify-stretch"
      >
        <InfoBox style="flex-1">
          <p className="text-sm color-[#8E8A8A] font-bold">Floor</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.floorPrice}
            {colInfo.currencyImage && colInfo.pools.length > 0 && (
              <Image
                src={colInfo.currencyImage.src}
                alt={colInfo.currencyImage.label}
                width={28}
                height={28}
                className="inline"
              />
            )}
          </p>
        </InfoBox>
        <InfoBox style="flex-1">
          <p className="text-sm color-[#8E8A8A] font-bold">Top Bid</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.topBid}
            {colInfo.currencyImage && colInfo.pools.length > 0 && (
              <Image
                src={colInfo.currencyImage.src}
                alt={colInfo.currencyImage.label}
                width={28}
                height={28}
                className="inline"
              />
            )}
          </p>
        </InfoBox>
        <InfoBox style="flex-1">
          <p className="text-sm color-[#8E8A8A] font-bold">Offer TVL</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.offerTVL}
            {colInfo.currencyImage && colInfo.pools.length > 0 && (
              <Image
                src={colInfo.currencyImage.src}
                alt={colInfo.currencyImage.label}
                width={28}
                height={28}
                className="inline"
              />
            )}
          </p>
        </InfoBox>
        <InfoBox style="flex-1">
          <p className="text-sm color-[#8E8A8A] font-bold">Listed</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.nftAmount}
          </p>
        </InfoBox>
        <InfoBox style="flex-1">
          <p className="text-sm color-[#8E8A8A] font-bold">Volume</p>
          <p className="flex items-baseline text-base font-bold text-white sm:text-2xl lg:text-2xl whitespace-nowrap">
            {colInfo.volume}
            {colInfo.currencyImage && colInfo.pools.length > 0 && (
              <Image
                src={colInfo.currencyImage.src}
                alt={colInfo.currencyImage.label}
                width={28}
                height={28}
                className="inline"
              />
            )}
          </p>
        </InfoBox>
      </section>
    </div>
  );
};

export default CollectionInfoHeader;
