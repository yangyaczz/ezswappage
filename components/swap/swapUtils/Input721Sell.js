import React, { useEffect } from "react";
import {
  BuyPoolLiner,
  TradePoolLiner,
  BuyPoolExp,
  TradePoolExp,
} from "../../utils/calculate";
import { ethers } from "ethers";
import { useLanguage } from "@/contexts/LanguageContext";

const Input721Sell = ({
  formikData,
  setSelectIds,
  setTupleEncode,
  setTotalGet,
  setIsExceeded,
  setIsBanSelect,
}) => {
  const{languageModel} = useLanguage();
  const update721SellToPairs = (tokenId, pairs) => {
    let protocolFee = 10000000000000000; // 0.5%  get from smartcontract
    let dec = 1e18;
    let maxPrice = 0;
    let maxPriceIndex = -1;

    // get pool buy price
    pairs.forEach((pair, index) => {
      let res;
      let params = [
        pair.spotPrice / dec,
        pair.delta / dec,
        pair.fee / dec,
        protocolFee / dec,
        pair.tokenIds.length + 1,
      ];

      if (pair.bondingCurve === "Linear" && pair.type === "buy") {
        res = BuyPoolLiner(...params);
      } else if (pair.bondingCurve === "Linear" && pair.type === "trade") {
        res = TradePoolLiner(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "buy") {
        res = BuyPoolExp(...params);
      } else if (pair.bondingCurve === "Exponential" && pair.type === "trade") {
        res = TradePoolExp(...params);
      } else {
        res;
      }

      if (res) {
        pair.userGetPrice = res.lastUserSellPrice;
        pair.ifUserAddGetPrice = res.userSellPrice;

        // get maxPrice pool
        if (pair.tokenBalance / dec >= res.poolBuyPrice) {
          const currentPrice = res.currentUintSellPrice;
          if (currentPrice > maxPrice) {
            maxPrice = currentPrice;
            maxPriceIndex = index;
          }
        }
      }
    });

    if (maxPriceIndex !== -1) {
      pairs[maxPriceIndex].tokenIds.push(tokenId);
      pairs[maxPriceIndex].userGetPrice =
        pairs[maxPriceIndex].ifUserAddGetPrice;
      pairs[maxPriceIndex].tuple = [
        [
          pairs[maxPriceIndex].id,
          pairs[maxPriceIndex].tokenIds,
          [pairs[maxPriceIndex].tokenIds.length],
        ],
        ethers.utils
          .parseEther(pairs[maxPriceIndex].userGetPrice.toString())
          .mul(ethers.BigNumber.from("995"))
          .div(ethers.BigNumber.from("1000")),
      ];
    } else {
      // console.log('nft execced amount')
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
      update721SellToPairs(id, pairs);
    });

    let tupleEncode = [];
    let totalGet = 0;
    let IdsAmount = 0;
    pairs.forEach((pair) => {
      if (pair.tuple) {
        tupleEncode.push(pair.tuple);
        totalGet += pair.userGetPrice;
        IdsAmount += pair.tokenIds.length;
      }
    });

    totalGet = Number(totalGet.toFixed(10));

    setTupleEncode(tupleEncode);
    setTotalGet(totalGet);
    ///////////////////////////////////////////////////////////////

    // check if is execeeded
    if (newSids.length > IdsAmount) {
      setIsExceeded(true);
    } else {
      setIsExceeded(false);
    }

    ///////////////////////////////////////////////////////////////
    // check if ban
    let newSidsPlus = new Array(newSids.length + 1).fill(0);
    let pairs2 = JSON.parse(JSON.stringify(formikData.filterPairs));
    newSidsPlus.forEach((id) => {
      update721SellToPairs(id, pairs2);
    });

    let IdsPlusAmount = 0;
    pairs2.forEach((pair) => {
      if (pair.tuple) {
        IdsPlusAmount += pair.tokenIds.length;
      }
    });

    if (newSidsPlus.length > IdsPlusAmount) {
      setIsBanSelect(true);
    } else {
      setIsBanSelect(false);
    }
  };

  useEffect(() => {
    console.log("check if ban init....");
    // check if ban
    let initSid = [0];
    let initpair = JSON.parse(JSON.stringify(formikData.filterPairs));
    initSid.forEach((id) => {
      update721SellToPairs(id, initpair);
    });

    let IdsPlusAmount = 0;
    initpair.forEach((pair) => {
      if (pair.tuple) {
        IdsPlusAmount += pair.tokenIds.length;
      }
    });

    if (initSid.length > IdsPlusAmount) {
      setIsBanSelect(true);
    } else {
      setIsBanSelect(false);
    }
  }, [formikData.token]);

  const initialSquares = formikData.userCollection.tokenIds721;

  if (!initialSquares.length) {
    return <div>{languageModel.YouDontHaveThisNFT}</div>;
  }

  return (
    <div className="flex flex-wrap">
      {initialSquares.map((square, index) => (
        <div
          key={index}
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
          onClick={() => {
            console.log(
              formikData.selectIds.includes(square),
              formikData.isBanSelect
            );
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
          <div>#{square}</div>
        </div>
      ))}
    </div>
  );
};

export default Input721Sell;
