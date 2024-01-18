const { default: Image } = require("next/image")

const PopupHeader = ({collectionName,collectionImageUrl,floorPrice,topBid})=>{
    return (
        <section
        id="place_bid_header"
        className="grid grid-cols-[1fr,3fr] gap-2 px-4 py-2 border-2 border-white border-solid w-5/6 max-w-[400px]"
      >
        <Image
          src={collectionImageUrl}
          alt={collectionName}
          width={70}
          height={70}
          className="place-self-center" />
        <section className="grid grid-cols-1 grid-rows-3">
          <label className="text-xl font-bold gap-x-1">
            {collectionName}
          </label>
          <div className="flex items-center justify-between text-sm leading-3 text-zinc-400">
            <p>Floor Price:</p>
            <p onClick={() => setBidPrice(floorPrice)} className="cursor-pointer">
              {floorPrice}
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={20}
                height={20}
                className="inline -translate-y-1" />
            </p>
          </div>
          <div className="flex items-center justify-between text-sm leading-3 text-zinc-400">
            <p>Top Bid:</p>
            <p onClick={() => setBidPrice(topBid)} className="cursor-pointer">
              {topBid}
              <Image
                src="/ETH.png"
                alt="Ethereum"
                width={20}
                height={20}
                className="inline -translate-y-1" />
            </p>
          </div>
        </section>
      </section>
    )
}

export default PopupHeader;