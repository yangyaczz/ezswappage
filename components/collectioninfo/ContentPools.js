import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import addressSymbol from "@/pages/data/address_symbol";
import networkConfig from "../../pages/data/networkconfig.json";
import { useNetwork, } from "wagmi";
import { useEffect, useState } from "react";
const ContentPools = () => {
  const { colInfo } = useCollectionInfo();
  const { pools, tradingCurrencyName, nftAmount } = colInfo;
  const EIGHTEEN_ZEROS = 1e18;
  const { chain } = useNetwork();
  const [golbalParams, setGolbalParams] = useState({})
  useEffect(() => {
    if (chain) {
      setGolbalParams(networkConfig[chain.id])
    }

  }, [chain]);
  return (
    <>
      {pools.map((pool) => (
        <div
          key={pool.id}
          className="w-full h-52 border-solid border-[1px] border-white rounded-lg p-4 grid grid-cols-4 grid-rows-2 justify-items-start items-center text-white font-bold"
        >
          <div className="flex items-center col-start-1 col-end-4 row-start-1 gap-4">
            <p
              className={` w-24 h-10  text-black flex justify-center items-center font-bold ${pool.type === "sell" && "bg-[#E48181]"
                } ${pool.type === "buy" && "bg-[#00D5DA]"} ${pool.type === "trade" && "bg-white"
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
            {/* Owner:{pool.owner.substring(0, 8)} */}
            Owner:&nbsp;
            <label className="self-end min-[500px]:text-xs text-[9px] align-baseline cursor-pointer text-end">{`${pool.owner.substring(
              0,
              5
            )}......${pool.owner.substring(
              pool.owner.length - 4
            )}`}</label>
          </p>


          <p
            className={` w-full text-left flex justify-start items-start ${pool.type === "sell" && "text-[#E48181]"
              } ${pool.type === "buy" && "text-[#00D5DA]"} ${pool.type === "trade" && "text-white w-36"
              }`}
          >
            {pool.type === "sell" && `Buy Price ${pool.userBuyPrice ?? 0} ` + addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
            {pool.type === "buy" && `Sell Price ${pool.userSellPrice ?? 0} ` + addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
            {pool.type === "trade" && (
              <span className="block">
                Buy Price {pool.userBuyPrice ?? 0} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
                <br />
                Sell Price {pool.userSellPrice ?? 0} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
              </span>
            )}
          </p>
          <p className="">Bonding Curve: {pool.bondingCurve}</p>
          {
            pool.bondingCurve === 'Linear' ? <>
              <p className="">Delta: {pool.delta} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
            </> : <p className="">Delta: {pool.delta?.toFixed(1)}%</p>
          }

          <p className="">Volume: {pool.ethVolume} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
        </div>
      ))}
    </>
  );
};

export default ContentPools;
