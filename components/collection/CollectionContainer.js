import { networkChains } from "@/pages/data/collection-data";
import Image from "next/image";

const CollectionContainer = ({ collection }) => {
  const { name, address, type, tokenId1155, img, network } = collection;
  const COLLECTION_PIC_SIZE = 90;
  const POLYGON_LOGO_DIMENSION = 48;

  return (
    // Divide Collection into 4 Grid Boxes, 2 columns by 2 rows
    <div
      className="w-11/12 h-64 border-2 border-solid border-zinc-100 grid gap-3 p-6"
      style={{
        gridTemplateColumns: "7fr 3fr",
        gridTemplateRows: "3fr 2fr",
      }}
    >
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
            <p className="text-2xl">{name}</p>
            <p>Estimated APR: 20%</p>
          </header>
          <div className="grid grid-cols-4-auto gap-x-4">
            <p>
              Floor Price: <span>10 ETH</span>
            </p>
            <p>
              NFT Amount: <span>10</span>
            </p>
            <p>
              Top Bid: <span>9 ETH</span>
            </p>
            <p>
              Offer TVL: <span>50 ETH</span>
            </p>
          </div>
        </div>
      </section>
      <section className="flex justify-between items-start">
        <div
          id="Rewards"
          className="grid grid-cols-2 grid-rows-2 gap-y-2 bg-[#D9D9D9] text-zinc-950 py-2 px-4 rounded-md"
        >
          <p className="col-span-3">Rewards</p>
          <div className="flex justify-start items-end">
            <Image src="/ETH.png" alt="ETH" width={26} height={26} />
            <p className="text-xl">10</p>
          </div>
          <button className="btn btn-success btn-sm text-white justify-self-start">
            Claim
          </button>
        </div>
        <div
          className="flex justify-center items-center"
          style={{
            width: `${COLLECTION_PIC_SIZE}px`,
            height: `${COLLECTION_PIC_SIZE}px`,
          }}
        >
          <Image
            src={networkChains[network].networkLogo}
            alt="Polygon"
            width={42}
            height={42}
          />
        </div>
      </section>
      <section className="flex justify-start items-center gap-x-8">
        <button className="btn btn-outline btn-success btn-xs w-32 h-10">
          Buy
        </button>
        <button className="btn btn-outline btn-success btn-xs w-32 h-10">
          Quick Sell
        </button>
        <button className="btn btn-success btn-xs w-32 h-10">Place Bid</button>
        <button className="btn btn-success btn-xs w-32 h-10">
          Deposit NFT
        </button>
      </section>
      <section className="flex justify-start items-center gap-x-4">
        <button className="btn btn-success btn-xs w-32 h-10">
          Add Liquidity
        </button>
        <p className="text-sm">Add liquidity to earn rewards</p>
      </section>
    </div>
  );
};

export default CollectionContainer;
