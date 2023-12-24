import { useEffect, useState } from "react";
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
  const {languageModel} = useLanguage()
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

    arrangeCollectionsByTradingPair();

function arrangeCollectionsByTradingPair() {
    setIsLoading(() => true);


    let colByPair = [];
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
                order:collection.order
              });
            }
          } else {
            //no pools found for this collection, still show collections but just only static data (default values to 0) and not filtered
            colByPair.push({
              ...collection,
              id: `${collection.address}`,
              pools: [],
              tradingCurrencyAddr: null,
              tradingCurrencyName: null,
              currencyImage: null,
              chainId: chainConfig?.hex,
              order:collection.order
            });
          }
        })
      );

    // Wait for all promises to resolve
    Promise.all(fetchPromises)
      .then(() => {
        colByPair.sort((a,b)=>a.order - b.order);
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
  }, [chain]);

  return (
    <div className="grid w-11/12 grid-cols-1 grid-rows-2 gap-3 place-items-center">
      {isLoading ? (
        <p className="h-max loading loading-bars loading-lg"></p>
      ) : (
        <>
          {collectionsByTradingPair.length === 0 ? (
            <p>{languageModel.noData}</p>
          ) : (
            collectionsByTradingPair.map((collection) => (
              <CollectionContainer
                key={collection.id}
                collection={collection}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CollectionList;
