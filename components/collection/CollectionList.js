import { useEffect, useState } from "react";
import CollectionContainer from "./CollectionContainer";
import collections from "@/pages/data/collection-data";
import { useNetwork, useAccount } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import addressSymbol from "@/pages/data/address_symbol";
import addressIcon from "@/pages/data/address_icon";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const CollectionList = () => {
  const { chain } = useNetwork();
  /*
    ideal data structure
    [
      {
        id:"0xaaaaaaa-ETH", (key)
        collectionAddress:"0xaaaaaaaaaa",
        tradingCurrencyAddr:"0x0000000000000000000000000000000000000000",
        tradingCurrencyName:"ETH"
        pools:[],

        ...other collection info
      }
    ]
  */

  const [collectionsByTradingPair, setCollectionsByTradingPair] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   We are going to sort all those collections into 'collection by trading pair'
   etc: 
   TOKEN_1 - ETH
   TOKEN_1 - USDT

   TOKEN_2 - ETH
   TOKEN_2 - DAI

   logic:
   1. we will get all the pools of each NFT collection by address
   2. figure out how many types of trading pairs are there by iterating pools of each collection 
   3. assign the (collectionAddress, tradingCurrency and related pools) to each new variable 'collectionsByTradingPair'
   */
  useEffect(() => {
    //set the chain params
    let chainConfig = {};
    if (chain && chain.id in networkConfig)
      chainConfig = networkConfig[chain.id];

    arrangeCollectionsByTradingPair();

    async function arrangeCollectionsByTradingPair() {
      setIsLoading(() => true);

      let colByPair = [];
      for (let collection of collections) {
        //only collections of the same network are visible
        if (collection.network === chainConfig.networkName) {
          let eachCollectionPools = await queryPoolsOfEachCollection(
            collection.address,
            collection.network
          );
          let colByCurrency =
            filterCollectionsByTradingPair(eachCollectionPools);

          for (let [currencyAddress, pools] of Object.entries(colByCurrency)) {
            colByPair.push({
              ...collection,
              id: `${collection.address}-${currencyAddress}`,
              pools: pools,
              tradingCurrencyAddr: currencyAddress,
              tradingCurrencyName:
                addressSymbol[chainConfig?.hex]?.[currencyAddress] ||
                "(UNKNOWN)",
              currencyImage: addressIcon[chainConfig?.hex]?.[
                currencyAddress
              ] || { label: "(UNKNOWN)", src: "/unknown.png" },
              chainId: chainConfig?.hex,
            });
          }
        }
      }

      setCollectionsByTradingPair(colByPair);
      setIsLoading(() => false);
    }

    function filterCollectionsByTradingPair(eachCollectionPools) {
      let colByCurrency = {}; // { currency:pools }. eg. "ETH" : [...pools]

      for (let pool of eachCollectionPools) {
        let { token } = pool;

        token = token === null ? ETH_ADDRESS : token; //when token is null, means ETH is the currency

        /**
        now append the pool to its relative currency
        should look like this:
        {
          "ETH":[pool_1, pool_2],
          "USDT":[pool_1, pool_2]
        }
         */
        colByCurrency[token] = !colByCurrency[token]
          ? [pool]
          : [...colByCurrency[token], pool];
      }

      return colByCurrency;
    }

    async function queryPoolsOfEachCollection(address, network) {
      const params = {
        contractAddress: address,
        network,
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data.data;
    }

    return () => {
      setCollectionsByTradingPair([]);
    };
  }, [chain]);

  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-3 w-11/12 place-items-center">
      {isLoading ? (
        <p className="h-max loading loading-bars loading-lg"></p>
      ) : (
        <div>
          {collectionsByTradingPair.length === 0 ? (
            <p>No data</p>
          ) : (
            collectionsByTradingPair.map((collection) => (
              <CollectionContainer
                key={collection.id}
                collection={collection}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionList;
