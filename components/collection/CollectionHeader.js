import Image from "next/image";

const CollectionHeader = ({ name, img, COLLECTION_PIC_SIZE }) => {
  return (
    <section
      className="grid gap-4"
      style={{ gridTemplateColumns: "90px auto", gridTemplateRows: "1fr" }}
    >
      <Image
        width={COLLECTION_PIC_SIZE}
        height={COLLECTION_PIC_SIZE}
        src={img}
        alt={name}
      />
      <div className="flex flex-col justify-start items-start gap-y-8">
        <header className="flex justify-start items-center w-full gap-x-8">
          <p className="text-lg md:text-xl lg:text-2xl">{name}</p>
          <p className="text-sm md:text-base lg:text-xl">Estimated APR: 20%</p>
        </header>
        <div className="grid grid-cols-2-auto grid-rows-2-auto lg:grid-cols-4-auto lg:grid-rows-1 gap-x-4">
          <p className="text-sm lg:text-base">
            Floor Price: <span>10 ETH</span>
          </p>
          <p className="text-sm lg:text-base">
            NFT Amount: <span>10</span>
          </p>
          <p className="text-sm lg:text-base">
            Top Bid: <span>9 ETH</span>
          </p>
          <p className="text-sm lg:text-base">
            Offer TVL: <span>50 ETH</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionHeader;
