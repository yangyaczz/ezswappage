import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import addressSymbol from "@/pages/data/address_symbol";
import networkConfig from "../../pages/data/networkconfig.json";
import { useNetwork, } from "wagmi";
import { useEffect, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
const ContentPools = () => {
  const { colInfo } = useCollectionInfo();
  const { pools, tradingCurrencyName, nftAmount } = colInfo;
  const EIGHTEEN_ZEROS = 1e18;
  const { chain } = useNetwork();
  const [golbalParams, setGolbalParams] = useState({})
  const { languageModel } = useLanguage();

  useEffect(() => {
    if (chain) {
      setGolbalParams(networkConfig[chain.id])
    }

  }, [chain]);

  const Owner = (pool) => {
    return <p className="col-span-4 row-start-1 max-[500px]:text-xs">
      {/* Owner:{pool.owner.substring(0, 8)} */}
      Owner:&nbsp;
      <label className="self-end min-[500px]:text-xs text-[9px] align-baseline cursor-pointer text-end">{`${pool.owner.substring(
        0,
        5
      )}......${pool.owner.substring(
        pool.owner.length - 4
      )}`}</label>
    </p>
  }
  return (
    <>
      {pools.map((pool) => (
        <div
          key={pool.id}
          className="w-full h-52 border-solid border-[1px] border-white rounded-lg p-4 grid grid-cols-4 grid-rows-2 justify-items-start items-center text-white font-bold"
        >
          <div className="flex items-center col-start-1 col-end-4 row-start-1 gap-4">
            <p
              className={`rounded-lg w-24 h-10 max-[500px]:w-14   text-black flex justify-center items-center font-bold ${pool.type === "sell" && "bg-[#E48181]"
                } ${pool.type === "buy" && "bg-[#00D5DA]"} ${pool.type === "trade" && "bg-white"
                }`}
            >
              {pool.type.substring(0, 1).toUpperCase() +
                pool.type.substring(1).toLowerCase()}
            </p>
            {/* Balance {pool.tokenBalance || pool.ethBalance || 0}{" "}
              {tradingCurrencyName} and {nftAmount} NFTS */}

            <div className="flex lg:items-center max-[800px]:flex-col ">
              {/* <span className="text-white	text-xl lg:text-2xl font-bold mr-4">{pool.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : pool.tokenName} - {pool.NFTName}</span> */}
              <span className="text-white text-sm align-baseline xl:text-base whitespace-nowrap max-[500px]:text-xs">
                {languageModel.Balance}:
                {Math.floor(pool.tokenBalance * 10000) / 10000}&nbsp;{tradingCurrencyName}&nbsp;{pool.tokenName === 'ETH' && addressSymbol[formikData.values.golbalParams.hex]?.["0x0000000000000000000000000000000000000000"] === 'EOS' ? 'EOS' : pool.tokenName} {languageModel.And} {pool.tokenType === 'ERC721' ? pool.nftCount : pool.nftCount1155} NFT
              </span>
              <div className="min-[800px]:hidden">
                {Owner(pool)}
              </div>
            </div>
          </div>
          <div className="max-[800px]:hidden">
            {Owner(pool)}
          </div>
          <div className="min-[800px]:hidden">
          </div>
          {/* <p className="col-span-4 row-start-1">

            Owner:&nbsp;
            <label className="self-end min-[500px]:text-xs text-[9px] align-baseline cursor-pointer text-end">{`${pool.owner.substring(
              0,
              5
            )}......${pool.owner.substring(
              pool.owner.length - 4
            )}`}</label>
          </p> */}

          <div className="col-span-4  w-full h-full flex max-[800px]:flex-col gap-1">
            {/* <p
              className={`flex-1 max-[500px]:text-xs w-full text-left flex justify-start items-start ${pool.type === "sell" && "text-[#E48181]"
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
            </p> */}

            <p
              className={`items-center flex-1 max-[500px]:text-xs w-full text-left flex justify-start  ${pool.type === "sell" && "text-[#E48181]"
                } ${pool.type === "buy" && "text-[#00D5DA]"} ${pool.type === "trade" && "text-white w-36"
                }`}
            >
              {pool.type === "sell" && `Buy Price ${pool.userBuyPrice ?? 0} ` + addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
              {pool.type === "buy" && `Sell Price ${pool.userSellPrice ?? 0} ` + addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
              {pool.type === "trade" && (
                <span className="block">
                  Buy Price: {pool.userBuyPrice ?? 0} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
                  <br />
                  Sell Price: {pool.userSellPrice ?? 0} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}
                </span>
              )}
            </p>
            <p className="items-center flex flex-1 max-[500px]:text-xs">Bonding Curve: {pool.bondingCurve}</p>
            {
              pool.bondingCurve === 'Linear' ? <>
                <p className="items-center flex flex-1 max-[500px]:text-xs">Delta: {pool.delta} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
              </> : <p className="items-center flex flex-1 max-[500px]:text-xs">Delta: {pool.delta?.toFixed(1)}%</p>
            }

            <p className="items-center flex flex-1 max-[500px]:text-xs">Volume: {pool.ethVolume} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
          </div>

          {/* <p
            className={` max-[500px]:text-xs w-full text-left flex justify-start items-start ${pool.type === "sell" && "text-[#E48181]"
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

          <p
            className={` max-[500px]:text-xs w-full text-left flex justify-start items-start ${pool.type === "sell" && "text-[#E48181]"
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
          <p className="max-[500px]:text-xs">Bonding Curve: {pool.bondingCurve}</p>
          {
            pool.bondingCurve === 'Linear' ? <>
              <p className="max-[500px]:text-xs">Delta: {pool.delta} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
            </> : <p className="max-[500px]:text-xs">Delta: {pool.delta?.toFixed(1)}%</p>
          }

          <p className="max-[500px]:text-xs">Volume: {pool.ethVolume} {addressSymbol[golbalParams.hex]?.["0x0000000000000000000000000000000000000000"]}</p>
 */}

        </div>
      ))}
    </>
  );
};

export default ContentPools;
