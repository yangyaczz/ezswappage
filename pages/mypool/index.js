import React, { useState, useEffect } from "react";

import networkConfig from "../data/networkconfig.json";
import {
  useNetwork,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useFormik } from "formik";

import {
  BuyPoolLiner,
  TradePoolLiner,
  BuyPoolExp,
  TradePoolExp,
} from "../../components/utils/calculate";
import PoolCard from "@/components/mypool/PoolCard";
import {useRouter} from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";

const MyPool = () => {
  const {languageModel} = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  const { chain } = useNetwork();
  const { address: owner } = useAccount();

  const formik = useFormik({
    initialValues: {
      golbalParams: "",
      pairs: [],
      filterPairs: [],
    },
  });

  useEffect(() => {
    setIsMounted(true);
    if (chain) {
      if (chain.id in networkConfig) {
        formik.setFieldValue("golbalParams", networkConfig[chain.id]);
      }
    }
  }, [chain]);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      if (formik.values.golbalParams.networkName) {
        const params = {
          userAddress: owner?.toLowerCase(),
          mode: formik.values.golbalParams.networkName,
        };

        const response = await fetch("/api/queryMypool", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (data.success) {
          let pairsList = data.data;

          formik.setFieldValue("pairs", pairsList);

          pairsList = pairsList.map((item) => {
            let tokenName, NFTName, poolTypeName, BondingCurveName;
            if (item.token === null) {
              tokenName = formik.values.golbalParams.hex === '0x4571' || formik.values.golbalParams.hex === '0x3cc5' ? "EOS" : "ETH";
            } else {
              let tokenNameRes =
                formik.values.golbalParams.recommendERC20?.find(
                  (obj) =>
                    obj.address?.toLowerCase() === item.token?.toLowerCase()
                );
              if (typeof tokenNameRes === "undefined") {
                tokenName = "Token";
              } else {
                tokenName = tokenNameRes.name;
              }
            }

            let NFTNameRes = formik.values.golbalParams.recommendNFT?.find(
              (obj) =>
                obj.address?.toLowerCase() === item.collection?.toLowerCase()
            );
            if (typeof NFTNameRes === "undefined") {
              if (item.collectionName) {
                NFTName = item.collectionName;
              } else {
                NFTName = "UnlistedERC1155";
              }
            } else {
              NFTName = NFTNameRes.name;
            }

            if (
              formik.values.golbalParams.linear.toLowerCase() ===
              item.bondingCurve.toLowerCase()
            ) {
              BondingCurveName = "Linear";
            } else if (
              formik.values.golbalParams.exponential.toLowerCase() ===
              item.bondingCurve.toLowerCase()
            ) {
              BondingCurveName = "Exponential";
            } else {
              BondingCurveName = "Unknown";
            }

            if (item.type === "0") {
              poolTypeName = "buy";
            } else if (item.type === "1") {
              poolTypeName = "sell";
            } else if (item.type === "2") {
              poolTypeName = "trade";
            } else {
              poolTypeName = "???";
            }

            //  calculate currentprice
            let protocolFee = 1e16; // 1%  get from smartcontract
            let dec = 1e18;
            let res;
            let params = [
              item.spotPrice / dec,
              item.delta / dec,
              item.fee / dec,
              protocolFee / dec,
              1,
            ];

            if (BondingCurveName === "Linear" && poolTypeName === "buy") {
              res = BuyPoolLiner(...params);
            } else if (
              BondingCurveName === "Linear" &&
              poolTypeName === "trade"
            ) {
              res = TradePoolLiner(...params);
            } else if (
              BondingCurveName === "Exponential" &&
              poolTypeName === "buy"
            ) {
              res = BuyPoolExp(...params);
            } else if (
              BondingCurveName === "Exponential" &&
              poolTypeName === "trade"
            ) {
              res = TradePoolExp(...params);
            } else {
              res;
            }

            return {
              ...item,
              tokenBalance: (
                (item.ethBalance === null
                  ? item.tokenBalance
                  : item.ethBalance) / 1e18
              // ).toFixed(3), // this pool token balance, vaild or not
              ), // this pool token balance, vaild or not
              tokenName: tokenName,
              NFTName: NFTName,
              currentPrice: item.spotPrice / dec,  //res?.userSellPrice
              BondingCurveName: BondingCurveName,
              poolTypeName: poolTypeName,
              deltaText:
                BondingCurveName === "Linear"
                  ? (item.delta / 1e18).toFixed(2)
                  : ((item.delta / 1e18 - 1) * 100).toFixed(2).toString() + "%",      // (item.delta / 1e18).toFixed(2).toString()
            };
          });

          formik.setFieldValue("filterPairs", pairsList);

          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [owner, formik.values.golbalParams]);

  if (!isMounted) {
    return null; //  <Loading /> ??
  }
  if (isLoading && formik.values.golbalParams.networkName !== undefined) {
    return (
      <div className="flex justify-center bg-base-200">
          <span>{languageModel.Loading}...<span className="ml-3 loading loading-spinner loading-sm"></span></span>
      </div>
    );
  }
  //
  // function goCollection(){
  //   router.push("/collection");
  // }
  return (
    <div className="flex flex-col items-center bg-base-200">
      <div className="min-[800px]:w-2/3 max-[799px]:w-5/6 mt-6">
      <div className="flex justify-center">
        <button onClick={() => router.push('/collection')} class="btn btn-active" className="bg-[#2ED1D8] text-white rounded-md px-4 py-1 mb-8 mt-4 text-lg">{languageModel.CreateNewPool} </button>
      </div>
        {formik.values.filterPairs.length===0 ? <div className="flex justify-center ">{languageModel.noData}</div>:formik.values.filterPairs?.map((item) => (
          <PoolCard key={item.id} item={item} formikData={formik} owner={owner} comeFrom="myPool"/>
        ))}
      </div>
    </div>
  );
};

export default MyPool;

// [
//     {
//         "id": "0xfeb2f96b80ae7f5ecfab80161b072a2d18f63c33",
//         "collection": "0xd48aa2a392a1c6253d88728e20d20f0203f8838c",
//         "owner": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "token": null,
//         "type": "0",
//         "assetRecipient": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "bondingCurve": "0xe567f07cd4aec9aedd8a54e4f2a4d24de204eb98",
//         "delta": "0",
//         "fee": "0",
//         "spotPrice": "20000000000000000",
//         "ethBalance": "160000000000000000",
//         "tokenBalance": null,
//         "ethVolume": "40000000000000000",
//         "createTimestamp": "1697184335",
//         "updateTimestamp": "1697441853",
//         "nftCount": "0",
//         "nftIds": [],
//         "fromPlatform": 1,
//         "is1155": true,
//         "nftId1155": "2",
//         "collectionName": "",
//         "tokenType": "ERC1155",
//         "nftCount1155": 0
//     },
//     {
//         "id": "0xda9d0c5f6d1b7b34349402a19af477d0705d40f7",
//         "collection": "0xd48aa2a392a1c6253d88728e20d20f0203f8838c",
//         "owner": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "token": null,
//         "type": "0",
//         "assetRecipient": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "bondingCurve": "0xe567f07cd4aec9aedd8a54e4f2a4d24de204eb98",
//         "delta": "0",
//         "fee": "0",
//         "spotPrice": "30000000000000000",
//         "ethBalance": "300000000000000000",
//         "tokenBalance": null,
//         "ethVolume": "0",
//         "createTimestamp": "1697184365",
//         "updateTimestamp": "1697184365",
//         "nftCount": "0",
//         "nftIds": [],
//         "fromPlatform": 1,
//         "is1155": true,
//         "nftId1155": "3",
//         "collectionName": "",
//         "tokenType": "ERC1155",
//         "nftCount1155": 0
//     },
//     {
//         "id": "0x24231d91afdfebc9388f4bcc770b77b2f8a62e54",
//         "collection": "0xd48aa2a392a1c6253d88728e20d20f0203f8838c",
//         "owner": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "token": null,
//         "type": "0",
//         "assetRecipient": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "bondingCurve": "0xe567f07cd4aec9aedd8a54e4f2a4d24de204eb98",
//         "delta": "0",
//         "fee": "0",
//         "spotPrice": "40000000000000000",
//         "ethBalance": "400000000000000000",
//         "tokenBalance": null,
//         "ethVolume": "0",
//         "createTimestamp": "1697184395",
//         "updateTimestamp": "1697184395",
//         "nftCount": "0",
//         "nftIds": [],
//         "fromPlatform": 1,
//         "is1155": true,
//         "nftId1155": "4",
//         "collectionName": "",
//         "tokenType": "ERC1155",
//         "nftCount1155": 0
//     },
//     {
//         "id": "0x5eaf0040a151c7e6b6c4dc3460f9ef063d8a41ff",
//         "collection": "0xd48aa2a392a1c6253d88728e20d20f0203f8838c",
//         "owner": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "token": null,
//         "type": "0",
//         "assetRecipient": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "bondingCurve": "0xe567f07cd4aec9aedd8a54e4f2a4d24de204eb98",
//         "delta": "0",
//         "fee": "0",
//         "spotPrice": "10000000000000000",
//         "ethBalance": "70000000000000000",
//         "tokenBalance": null,
//         "ethVolume": "30000000000000000",
//         "createTimestamp": "1697184405",
//         "updateTimestamp": "1697441693",
//         "nftCount": "0",
//         "nftIds": [],
//         "fromPlatform": 1,
//         "is1155": true,
//         "nftId1155": "1",
//         "collectionName": "",
//         "tokenType": "ERC1155",
//         "nftCount1155": 0
//     },
//     {
//         "id": "0x89e55b1ff5c39eb3b7d5889878411a58a107e83d",
//         "collection": "0x3d3fa1f6de1a8e8f466bf6598b2601a250643464",
//         "owner": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "token": null,
//         "type": "0",
//         "assetRecipient": "0x21c8e614cd5c37765411066d2ec09912020c846f",
//         "bondingCurve": "0xe567f07cd4aec9aedd8a54e4f2a4d24de204eb98",
//         "delta": "0",
//         "fee": "0",
//         "spotPrice": "10000000000000000",
//         "ethBalance": "200000000000000000",
//         "tokenBalance": null,
//         "ethVolume": "0",
//         "createTimestamp": "1697593008",
//         "updateTimestamp": "1697593008",
//         "nftCount": "0",
//         "nftIds": [],
//         "fromPlatform": 1,
//         "is1155": false,
//         "nftId1155": "0",
//         "collectionName": "tsez721First",
//         "tokenType": "ERC721",
//         "nftCount1155": 0
//     }
// ]
