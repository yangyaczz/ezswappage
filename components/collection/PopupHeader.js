import { useCollection } from "@/contexts/CollectionContext";

const { default: Image } = require("next/image");

const PopupHeader = ({ handlePriceClick = () => {}, styleClass = null }) => {
  const {
    collectionName,
    collectionImageUrl,
    currencyImage,
    floorPrice,
    topBid,
  } = useCollection();

  return (
    <section
      id="place_bid_header"
      className={`grid grid-cols-[1fr,3fr] gap-2 rounded-md ${styleClass}`}
    >
      <img
        src={collectionImageUrl}
        alt={collectionName}
        width={70}
        height={70}
        className="place-self-center"
      />
      <section className="grid grid-cols-1 grid-rows-3">
        <label className="text-xl font-bold truncate align-center gap-x-1">
          {collectionName}
        </label>
        <div className="flex items-center justify-between text-sm leading-3 text-zinc-400 font-bold">
          <p>Floor Price:</p>
          <p
            onClick={() => handlePriceClick(floorPrice)}
            className="cursor-pointer"
          >
            {floorPrice}
            <Image
              src={currencyImage?.src}
              alt={currencyImage?.label}
              width={20}
              height={20}
              className="inline -translate-y-1"
            />
          </p>
        </div>
        <div className="flex items-center justify-between text-sm leading-3 text-zinc-400 font-bold">
          <p>Top Bid:</p>
          <p
            onClick={() => handlePriceClick(topBid)}
            className="cursor-pointer"
          >
            {topBid}
            <Image
              src={currencyImage?.src}
              alt={currencyImage?.label}
              width={20}
              height={20}
              className="inline -translate-y-1"
            />
          </p>
        </div>
      </section>
    </section>
  );
};

export default PopupHeader;
