import { useCollectionInfo } from "@/contexts/CollectionInfoContext";

const ContentPools = () => {
  const { colInfo } = useCollectionInfo();
  const { pools, tradingCurrencyName, nftAmount } = colInfo;
  const EIGHTEEN_ZEROS = 1e18;

  return (
    <>
      {pools.map((pool) => (
        <div
          key={pool.id}
          className="w-full h-52 border-solid border-[1px] border-white rounded-lg p-4 grid grid-cols-4 grid-rows-2 justify-items-start items-center text-white font-bold"
        >
          <div className="flex items-center col-start-1 col-end-4 row-start-1 gap-4">
            <p
              className={` w-24 h-10  text-black flex justify-center items-center font-bold ${
                pool.type === "sell" && "bg-[#E48181]"
              } ${pool.type === "buy" && "bg-[#00D5DA]"} ${
                pool.type === "trade" && "bg-white"
              }`}
            >
              {pool.type.substring(0, 1).toUpperCase() +
                pool.type.substring(1).toLowerCase()}
            </p>
            <p>
              Balance {pool.tokenBalance || pool.ethBalance || 0}{" "}
              {tradingCurrencyName} and {nftAmount} NFTS
            </p>
          </div>
          <p className="col-span-4 row-start-1">
            Owner:{pool.owner.substring(0, 8)}
          </p>
          <p
            className={` w-24 flex justify-center items-center ${
              pool.type === "sell" && "text-[#E48181]"
            } ${pool.type === "buy" && "text-[#00D5DA]"} ${
              pool.type === "trade" && "text-white w-36"
            }`}
          >
            {pool.type === "sell" && `Buy Price ${pool.userBuyPrice ?? 0}`}
            {pool.type === "buy" && `Sell Price ${pool.userSellPrice ?? 0}`}
            {pool.type === "trade" && (
                <span className="block">
                  Buy Price {pool.userBuyPrice ?? 0}
                  <br/>
                  Sell Price {pool.userSellPrice ?? 0}
                </span>
              )}
          </p>
          <p className="">Bonding Curve: {pool.bondingCurve}</p>
          <p className="">Delta: {pool.delta}</p>
          <p className="">Volume: {pool.ethVolume}</p>
        </div>
      ))}
    </>
  );
};

export default ContentPools;
