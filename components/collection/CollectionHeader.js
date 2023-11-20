import Image from "next/image";

const CollectionHeader = ({
  name,
  img,
  COLLECTION_PIC_SIZE,
  floorPrice,
  topBid,
  nftAmount,
  offerTVL,
}) => {
  return (
    <section className="grid gap-4 grid-cols-[90px,auto] grid-rows-1">
      <Image
        width={COLLECTION_PIC_SIZE}
        height={COLLECTION_PIC_SIZE}
        src={img}
        alt={name}
      />
      <div className="flex flex-col justify-start items-start gap-y-4 ">
        <header className="flex justify-start items-center w-full gap-x-8">
          <p className="font-bold text-sm md:text-lg lg:text-xl">{name}</p>
          <p className="text-sm lg:text-base">Estimated APR: 20%</p>
        </header>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 lg:grid-cols-4-auto lg:grid-rows-1 gap-x-4">
          <p className="text-sm xl:text-base">
            Floor Price: <span>{floorPrice} ETH</span>
          </p>
          <p className="text-sm xl:text-base">
            NFT Amount: <span>{nftAmount}</span>
          </p>
          <p className="text-sm xl:text-base">
            Top Bid: <span>{topBid} ETH</span>
          </p>
          <p className="text-sm xl:text-base">
            Offer TVL: <span>{offerTVL} ETH</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionHeader;
