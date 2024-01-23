import React, { useState, useEffect } from "react";
import addressSymbol from "@/pages/data/address_symbol";
import {
  SellPoolLiner,
  TradePoolLiner,
  SellPoolExp,
  TradePoolExp,
} from "../../utils/calculate";
import { ethers } from "ethers";

function mapIdsToPrices(ids, prices) {
  let result = {};
  ids.forEach((subArray, index) => {
    const price = prices[index];
    subArray.forEach((id) => {
      result[id] = price;
    });
  });

  return result;
}

const Input721Buy = ({
  formikData,
  setSelectIds,
  setTupleEncode,
  setTotalGet,
  setIsExceeded,
}) => {
  const [idPriceMap, setIdPriceMap] = useState({});

  const update721BuyToPairs = (tokenId, pairs) => {
    // 找到pair后， 将 id 放入pair 中， 同时把它的价格和id 更新到useState中
    // 更新 pair 的 nftIdsPrice 价格
    // encode tuple

    let protocolFee = 10000000000000000; // 0.5%  get from smartcontract
    let dec = 1e18;

    const pair = pairs.find((pair) => pair.nftIds.includes(tokenId));

    if (pair) {
      pair.tokenIds.push(tokenId);

      let update = { [tokenId]: pair.nftIdsPrice };
      for (let key in update) {
        if (update.hasOwnProperty(key)) {
          pair.shoppingCart[key] = update[key];
        }
      }

      let params = [
        pair.spotPrice / dec,
        pair.delta / dec,
        pair.fee / dec,
        protocolFee / dec,
        pair.tokenIds.length + 1,
      ];
      let res;
      if (pair.bondingCurve === "Linear" && pair.type === "sell") {
        res = SellPoolLiner(...params);
      } else if (pair.bondingCurve === "Linear" && pair.type === "trade") {
        res = TradePoolLiner(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "sell") {
        res = SellPoolExp(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "trade") {
        res = TradePoolExp(...params);
      } else {
        res;
      }

      pair.nftIdsPrice = res.currentUintBuyPrice;
      pair.userGetPrice = Number((res.lastUserBuyPrice * 1.005).toFixed(10)); // 0.5 % slippling
      console.log("userGetPrice", pair.userGetPrice);
      console.log('formikData', formikData)
      pair.tuple = [
        [pair.id, pair.tokenIds, [pair.tokenIds.length]],
        ethers.utils.parseEther(pair.userGetPrice.toString()),
      ];
    }
  };

  const toggleSelected = (id) => {
    // add new id to formikdata
    let newSids;
    if (formikData.selectIds.includes(id)) {
      newSids = formikData.selectIds.filter((item) => item !== id);
    } else {
      newSids = [...formikData.selectIds, id];
    }
    setSelectIds(newSids);

    ///////////////////////////////////////////////////////////////

    let pairs = JSON.parse(JSON.stringify(formikData.filterPairs));

    newSids.forEach((id) => {
      update721BuyToPairs(id, pairs);
    });

    // update idPriceMap
    let ids = pairs.map((item) => item.nftIds);
    let prices = pairs.map((item) => item.nftIdsPrice);

    let idPriceMap = mapIdsToPrices(ids, prices);

    let sc = pairs.map((pair) => pair.shoppingCart);
    sc = Object.assign({}, ...sc);

    for (let key in sc) {
      if (sc.hasOwnProperty(key)) {
        idPriceMap[key] = sc[key];
      }
    }
    setIdPriceMap(idPriceMap);

    /////////////////////////////////////////////

    let tupleEncode = [];
    let totalGet = 0;
    pairs.forEach((pair) => {
      if (pair.tuple) {
        tupleEncode.push(pair.tuple);
        totalGet += pair.userGetPrice;
      }
    });

    totalGet = Number(totalGet.toFixed(10));

    setTupleEncode(tupleEncode);
    setTotalGet(totalGet);
    ///////////////////////////////////////////////////////////////

    // check if is execeeded ,if totalGet > user balance
    if (formikData.userCollection.tokenBalance20 < totalGet) {
      setIsExceeded(true);
    } else {
      setIsExceeded(false);
    }
  };

  useEffect(() => {
    console.log("formikData111", formikData.collection.img);
    const ids = formikData.filterPairs?.map((item) => item.nftIds);
    const prices = formikData.filterPairs?.map((item) => item.nftIdsPrice);
    const idPriceMap = mapIdsToPrices(ids, prices);
    setIdPriceMap(idPriceMap);
  }, [formikData.filterPairs]);

  return (
    <div className="flex flex-wrap justify-center">
      {Object.keys(idPriceMap)
        .sort((a, b) => {
          const aSelected = formikData.selectIds.includes(a);
          const bSelected = formikData.selectIds.includes(b);
          if (aSelected === bSelected) {
            return parseFloat(idPriceMap[a]) - parseFloat(idPriceMap[b]);
          }
          return aSelected ? -1 : 1;
        })
        .map((square, index) => (
          <div
            key={square}
            data-tip={
              formikData.isBanSelect && "this collection has no liquidity"
            }
            className={`
                                    p-3 mr-2 mb-5 cursor-pointer
                                    ${
                                      formikData.selectIds.includes(square)
                                        ? "bg-[#28B7BC3B]"
                                        : formikData.isBanSelect &&
                                          "!cursor-not-allowed tooltip bg-gray-500 opacity-50"
                                    }
                                `}
          >
            <div
              onClick={() => {
                if (
                  formikData.selectIds.includes(square) ||
                  !formikData.isBanSelect
                ) {
                  toggleSelected(square);
                }
              }}
            >
              {formikData.selectIds.includes(square) && (
                <img className="absolute w-6" src="/yes.svg" alt="" />
              )}
              <img className="w-20" src={formikData.collection.img} alt="" />
              <div className="font-bold">#{square}</div>
            </div>
            <div className="flex items-center content-center mt-1 font-bold">
              <span>{idPriceMap[square].toFixed(5)}</span>&nbsp;{addressSymbol[formikData.golbalParams.hex]["0x0000000000000000000000000000000000000000"]}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Input721Buy;
