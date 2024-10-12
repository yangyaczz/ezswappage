"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import { MaxFiveDecimal } from "@/components/utils/roundoff";
import { useNetwork } from "wagmi";
import addressSymbol from "@/pages/data/address_symbol";
import addressIcon from "@/pages/data/address_icon";
import networkConfig from "../../../../pages/data/networkconfig.json";

import CollectionInfoHeader from "@/components/collectioninfo/CollectionInfoHeader";
import ActionBar from "@/components/collectioninfo/ActionBar";
import ContentBar from "@/components/collectioninfo/ContentBar";
import ContentSection from "@/components/collectioninfo/ContentSection";
import collections from "@/pages/data/collection-data";
import calculatePoolAllInfo from "@/components/utils/calculatePoolInfo";
import ContentBuyCart from "@/components/collectioninfo/ContentBuyCart";
import { useParams } from "next/navigation";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const SLIPPING_RATE = 1.005;

const CollectionInfo = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const { loaded, loadColInfo } = useCollectionInfo();

  useEffect(() => {
    let chainConfig = {};
    if (router.isReady) setup();

    async function setup() {
      if (chain && chain.id in networkConfig)
        chainConfig = networkConfig[chain.id];

      // 给个默认值显示eos,改成显示manta,不然会显示no data
      if (chainConfig === undefined || chainConfig.networkName === undefined) {
        chainConfig = networkConfig[169];
      }

      if (!loaded) {
        await loadCollectionInfo();
      }
    }

    async function loadCollectionInfo() {
      let { address, tokenId1155 } = router.query;
      let eachCollectionPools = [];
      let id1155 =
        tokenId1155 && tokenId1155.length === 1 ? tokenId1155[0] : null;
      let collection = collections.find((collection) => {
        return (
          //finds erc721 if only collection address is given
          (address === collection.address && !collection.tokenId1155) ||
          //finds erc1155 if both address and tokenId are given
          (address === collection.address &&
            collection.tokenId1155 &&
            id1155 &&
            collection.tokenId1155 === id1155)
        );
      });
      if (collection == undefined) return router.push("/collection");
      // if no collection found, redirect to collection page

      //now find pools in the collection
      eachCollectionPools = await queryPoolsOfEachCollection(
        collection.address,
        collection.network,
        collection.type,
        collection.tokenId1155
      );

      //if there are pools found, sort the collections by trading pairs and show dynamic data
      if (eachCollectionPools?.length > 0) {
        let colByCurrency = filterCollectionsByTradingPair(eachCollectionPools);
        let [currencyAddress, pools] = Object.entries(colByCurrency)[0];
        let {
          bestUserBuyPrice,
          bestUserSellPrice,
          nftCount,
          TVL,
          volume,
          newPools,
        } = calculatePoolAllInfo(pools, address);

        //just to format the prices to  2 decimals. But no decimal if equals to 0.
        //prettier-ignore
        bestUserBuyPrice = parseFloat((bestUserBuyPrice * SLIPPING_RATE).toFixed(6)).toFixed(MaxFiveDecimal(bestUserBuyPrice * SLIPPING_RATE));
        //prettier-ignore
        bestUserSellPrice = bestUserSellPrice?.toFixed(MaxFiveDecimal(bestUserSellPrice));
        //prettier-ignore
        TVL = TVL?.toFixed(MaxFiveDecimal(TVL));
        volume = volume?.toFixed(MaxFiveDecimal(volume));

        await loadColInfo(
          collection.address,
          collection.name,
          collection.img,
          bestUserBuyPrice,
          bestUserSellPrice,
          nftCount,
          TVL,
          volume,
          collection.type,
          collection.tokenId1155,
          newPools,
          addressSymbol[chainConfig?.hex]?.[currencyAddress] || "(UNKNOWN)",
          addressIcon[chainConfig?.hex]?.[currencyAddress] || {
            label: "(UNKNOWN)",
            src: "/unknown.png",
          },
          chainConfig?.hex
        );
      }
      // no pools found for this collection, only load basic info
      else
        await loadColInfo(
          collection.address,
          collection.name,
          collection.img,
          0,
          0,
          0,
          0,
          0,
          collection.type,
          collection.tokenId1155,
          [],
          "(UNKNOWN)",
          {
            label: "(UNKNOWN)",
            src: "/unknown.png",
          },
          chainConfig?.hex
        );
    }
  }, [router.isReady]);

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

  function queryPoolsOfEachCollection(address, network, type, tokenId1155) {
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

  return (
    <div className="flex h-full">
      <div className="flex flex-col items-stretch justify-start w-full h-full gap-8 px-10 py-6">
        <CollectionInfoHeader />
        {/* <ActionBar /> */}
        <ContentBar />
        <ContentSection />

      </div>
      <ContentBuyCart />
    </div>

  );
};

export default CollectionInfo;
