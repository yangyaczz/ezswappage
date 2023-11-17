import { networkChains } from "@/pages/data/collection-data";
import Image from "next/image";

const Rewards = ({ COLLECTION_PIC_SIZE, network }) => {
  return (
    <section className="flex justify-between items-start">
      <div
        id="Rewards"
        className="grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 gap-y-2 bg-[#D9D9D9] text-zinc-950 py-2 px-1 sm:px-4 rounded-md"
      >
        <p className="col-span-full text-sm sm:text-base xl:text-lg ">
          Rewards
        </p>
        <div className="flex justify-start items-center">
          <Image
            src="/ETH.png"
            alt="ETH"
            width={26}
            height={26}
            className="w-5 h-5 lg:w-6 lg:h-6"
          />
          <p className="text-xl sm:text-sm md:text-base lg:text-xl xl:text-2xl">
            10
          </p>
        </div>
        <button className="btn btn-success ezBtn btn-xs text-xs !bg-[#3C9F9F] lg:text-sm xl:text-base xl:btn-sm w-full md:w-12 lg:w-16 xl:w-22 text-white font-normal justify-self-start">
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
  );
};

export default Rewards;
