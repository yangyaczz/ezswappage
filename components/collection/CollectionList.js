import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CollectionContainer from "./CollectionContainer";
import collections from "@/pages/data/collection-data";
import { useNetwork, useAccount } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import addressSymbol from "@/pages/data/address_symbol";
import addressIcon from "@/pages/data/address_icon";
import { useLanguage } from "@/contexts/LanguageContext";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const CollectionList = () => {
  const { chain } = useNetwork();
  const { languageModel } = useLanguage()
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
  const [searchCollection, setSearchCollection] = useState("");

  /**
   We are going to sort all those collections into 'collection by trading pair'
   etc:
   TOKEN_1 - ETH
   TOKEN_1 - USDT

   TOKEN_2 - ETH
   TOKEN_2 - DAI

   logic:
   1. get all the pools of each NFT collection by address
   2. if there's valid pools
   2.1. figure out how many types of trading pairs are there by iterating through pools of each collection
   2.2. assign the (collectionAddress, tradingCurrency... and related pools) to each new variable 'collectionsByTradingPair'
   3. if there is no valid pools
   3.1. still display collections, but no dynamic data and not filtered with trading pairs by pools
   3.2. which means push 'null' data into 'tradingCurrency...' and 'pools' variable
   */
  useEffect(() => {
    //set the chain params
    let chainConfig = {};
    if (chain && chain.id in networkConfig)
      chainConfig = networkConfig[chain.id];

    // 给个默认值显示eos,改成显示manta,不然会显示no data
    if (chainConfig === undefined || chainConfig.networkName === undefined) {
      chainConfig = networkConfig[169]
    }
    arrangeCollectionsByTradingPair();

    // <<<<<<< HEAD

    function arrangeCollectionsByTradingPair() {
      setIsLoading(() => true);
      // =======
      //     let colByPair = [];
      //     const fetchPromises = collections
      //       .filter((collection) => collection.network === chainConfig.networkName)
      //       .map((collection) =>
      //         queryPoolsOfEachCollection(
      //           collection.address,
      //           collection.network,
      //           collection.type,
      //           collection.tokenId1155
      //         ).then((eachCollectionPools) => {
      //           //if there are pools found, sort the collections by trading pairs and show dynamic data
      //           if (eachCollectionPools?.length > 0) {
      //             let colByCurrency =
      //               filterCollectionsByTradingPair(eachCollectionPools);
      //             for (let [currencyAddress, pools] of Object.entries(
      //               colByCurrency
      //             )) {
      //               colByPair.push({
      //                 ...collection,
      //                 id: `${collection.address}/${currencyAddress}/${collection.tokenId1155}`,
      //                 pools: pools,
      //                 tradingCurrencyAddr: currencyAddress,
      //                 tradingCurrencyName:
      //                   addressSymbol[chainConfig?.hex]?.[currencyAddress] ||
      //                   "(UNKNOWN)",
      //                 currencyImage: addressIcon[chainConfig?.hex]?.[
      //                   currencyAddress
      //                 ] || { label: "(UNKNOWN)", src: "/unknown.png" },
      //                 chainId: chainConfig?.hex,
      //                 order:collection.order
      //               });
      //             }
      //           } else {
      //             //no pools found for this collection, still show collections but just only static data (default values to 0) and not filtered
      //             colByPair.push({
      //               ...collection,
      //               id: `${collection.address}/${collection.tokenId1155}`,
      //               pools: [],,,
      //               tradingCurrencyAddr: null,
      //               tradingCurrencyName: null,
      //               currencyImage: addressIcon[chainConfig?.hex]?.['0x0000000000000000000000000000000000000000'] || { label: "(UNKNOWN)", src: "/unknown.png" },
      //               chainId: chainConfig?.hex,
      //               order:collection.order
      //             });
      //           }
      //         })
      //       );
      // >>>>>>> colv2


      let colByPair = [];
      // debugger
      const fetchPromises = collections
        .filter((collection) => collection.network === chainConfig.networkName)
        .map((collection) =>
          queryPoolsOfEachCollection(
            collection.address,
            collection.network,
            collection.type,
            collection.tokenId1155
          ).then((eachCollectionPools) => {
            //if there are pools found, sort the collections by trading pairs and show dynamic data
            if (eachCollectionPools?.length > 0) {
              let colByCurrency =
                filterCollectionsByTradingPair(eachCollectionPools);
              for (let [currencyAddress, pools] of Object.entries(
                colByCurrency
              )) {
                // console.log('collection.address', collection)
                //搜索功能
                if (searchCollection !== '' && collection.address.toLowerCase().indexOf(searchCollection.toLowerCase()) === -1 && collection.name.toLowerCase().indexOf(searchCollection.toLowerCase()) === -1) {
                  continue
                }
                colByPair.push({
                  ...collection,
                  id: `${collection.address}-${currencyAddress}-${collection.tokenId1155}`,
                  pools: pools,
                  tradingCurrencyAddr: currencyAddress,
                  tradingCurrencyName:
                    addressSymbol[chainConfig?.hex]?.[currencyAddress] ||
                    "(UNKNOWN)",
                  currencyImage: addressIcon[chainConfig?.hex]?.[
                    currencyAddress
                  ] || { label: "(UNKNOWN)", src: "/unknown.png" },
                  chainId: chainConfig?.hex,
                  order: collection.order
                });
              }
            } else {
              //no pools found for this collection, still show collections but just only static data (default values to 0) and not filtered
              colByPair.push({
                ...collection,
                id: `${collection.address}-${collection.tokenId1155}`,
                pools: [],
                tradingCurrencyAddr: null,
                tradingCurrencyName: null,
                currencyImage: addressIcon[chainConfig?.hex]?.['0x0000000000000000000000000000000000000000'] || { label: "(UNKNOWN)", src: "/unknown.png" },
                chainId: chainConfig?.hex,
                order: collection.order
              });
            }
          })
        );

      // Wait for all promises to resolve
      Promise.all(fetchPromises)
        .then(() => {
          colByPair.sort((a, b) => a.order - b.order);
          setCollectionsByTradingPair(colByPair);
          setIsLoading(() => false);
        })
        .catch((error) => {
          console.error("Error fetching collections:", error);
          setIsLoading(() => false);
        });
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

    function queryPoolsOfEachCollection(
      address,
      network,
      type,
      tokenId1155
    ) {
      let params = {
        contractAddress: address,
        network,
      };
      if (type === "ERC1155") params = { ...params, tokenId: tokenId1155 };

      return fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
        .then((response) => response.json())
        .then((data) => data.data);
    }

    return () => {
      setCollectionsByTradingPair([]);
    };
  }, [chain, searchCollection.length >= 3]);

  const handleDepositInputChange = (e) => {
    setSearchCollection(e.target.value)
    // arrangeCollectionsByTradingPair()
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="w-11/12 max-w-[1240px] input input-bordered flex items-center gap-2 mb-5 bg-black text-white border-[1px] border-solid border-zinc-100 rounded-md">
        <input type="text" className="grow bg-black" placeholder="Search collection or contract" value={searchCollection}
          onChange={handleDepositInputChange} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
          <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
        </svg>
      </label>
      <div className="flex w-full flex-col items-center gap-3">
        {isLoading ? (<p className="h-max loading loading-bars loading-lg"></p>) : (
          <>
            {collectionsByTradingPair.length === 0 ? (<p>{languageModel.noData}</p>) : (
              collectionsByTradingPair.map((collection) => (
                <CollectionContainer key={collection.id} collection={collection} />
              ))

            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
