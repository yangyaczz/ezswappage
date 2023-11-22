import networkChains from "@/pages/data/networkChains";
import Image from "next/image";

const Rewards = ({ COLLECTION_PIC_SIZE, network }) => {
  return (
    <section className="flex justify-around items-stretch">
      <div
        id="Rewards"
        className="grid grid-cols-1 grid-rows-3 lg:grid-cols-2 lg:grid-rows-2 flex-[0 0 auto] w-20 sm:w-24 min-[816px]:w-28 lg:w-36 xl:w-40 bg-[#D9D9D9] text-zinc-950 py-2 px-1 sm:px-4 rounded-md"
      >
        <p className="col-span-full text-base xl:text-lg ">Rewards</p>
        <div className="flex justify-start items-center">
          <Image
            src="/ETH.png"
            alt="ETH"
            width={26}
            height={26}
            className="w-5 h-5 lg:w-6 lg:h-6"
          />
          <p className="text-xl md:text-base lg:text-xl">10</p>
        </div>
        <button className="btn btn-success ezBtn btn-xs text-xs !font-extrabold !bg-[#3C9F9F] xl:text-sm xl:btn-sm w-full xl:px-2 text-white place-self-center">
          Claim
        </button>
      </div>
      <div
        className={`flex justify-center items-center w-auto h-[${COLLECTION_PIC_SIZE}px] flex-auto`}
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
