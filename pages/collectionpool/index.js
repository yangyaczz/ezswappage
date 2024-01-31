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
    SellPoolLiner,
    TradePoolLiner,
    BuyPoolExp,
    SellPoolExp,
    TradePoolExp,
} from "../../components/utils/calculate";
import PoolCard from "@/components/mypool/PoolCard";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import PoolFilter from "@/components/mypool/PoolFilter";

const MyPool = () => {
    const { languageModel } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tempPoolList, setTempPoolList] = useState([]);
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
            let contractAddress = router.query.contractAddress
            let tokenId = router.query.tokenId
            if (contractAddress === undefined || contractAddress === null) {
                contractAddress = sessionStorage.getItem("collectionContractAddress")
                tokenId = sessionStorage.getItem("collectionTokenId")
            }
            if (formik.values.golbalParams.networkName) {
                const params = {
                    contractAddress: contractAddress,
                    mode: formik.values.golbalParams.networkName,
                    tokenId: tokenId
                };
                // console.log('router', router.query)
                const response = await fetch("/api/queryCollectionPool", {
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
                            tokenName = "ETH";
                        } else {
                            let tokenNameRes =
                                formik.values.golbalParams.recommendERC20?.find(
                                    (obj) =>
                                        obj.address?.toLowerCase() === item.token?.toLowerCase()
                                );
                            if (typeof tokenNameRes === "undefined") {
                                tokenName = "UnlistedERC20";
                            } else {
                                tokenName = tokenNameRes.name;
                            }
                        }
                        let NFTNameRes = formik.values.golbalParams.recommendNFT?.find(
                            (obj) => obj.address?.toLowerCase() === item.collection?.toLowerCase() && (obj.type === 'ERC1155' ? obj.tokenId1155 === item.nftId1155 : true));
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
                        let fixNum = 5
                        let res;
                        let params = [
                            item.spotPrice / dec,
                            item.delta / dec,
                            item.fee / dec,
                            protocolFee / dec,
                            1,
                        ];

                        let currentSellPrice;
                        let currentBuyPrice;

                        if (BondingCurveName === "Linear" && poolTypeName === "buy") {
                            res = BuyPoolLiner(...params);
                            currentSellPrice = res.currentUintSellPrice.toFixed(fixNum)
                        } else if (
                            BondingCurveName === "Linear" &&
                            poolTypeName === "sell"
                        ) {
                            res = SellPoolLiner(...params);
                            currentBuyPrice = res.currentUintBuyPrice.toFixed(fixNum)
                        } else if (
                            BondingCurveName === "Linear" &&
                            poolTypeName === "trade"
                        ) {
                            res = TradePoolLiner(...params);
                            currentSellPrice = res.currentUintSellPrice.toFixed(fixNum)
                            currentBuyPrice = res.currentUintBuyPrice.toFixed(fixNum)
                        } else if (
                            BondingCurveName === "Exponential" &&
                            poolTypeName === "buy"
                        ) {
                            res = BuyPoolExp(...params);
                            currentSellPrice = res.currentUintSellPrice.toFixed(fixNum)
                        } else if (
                            BondingCurveName === "Exponential" &&
                            poolTypeName === "sell"
                        ) {
                            res = SellPoolExp(...params);
                            currentBuyPrice = res.currentUintBuyPrice.toFixed(fixNum)
                        } else if (
                            BondingCurveName === "Exponential" &&
                            poolTypeName === "trade"
                        ) {
                            res = TradePoolExp(...params);
                            currentSellPrice = res.currentUintSellPrice.toFixed(fixNum)
                            currentBuyPrice = res.currentUintBuyPrice.toFixed(fixNum)
                        } else {
                            res;
                        }

                        // delta text
                        let deltaText;

                        if (BondingCurveName === "Linear") {
                            deltaText = (item.delta / 1e18).toFixed(2)
                        } else if (BondingCurveName === "Exponential" && poolTypeName === "buy") {
                            deltaText = ((1 - 1e18 / item.delta) * 100).toFixed(2).toString() + "%"
                        } else {
                            deltaText = ((item.delta / 1e18 - 1) * 100).toFixed(2).toString() + "%"
                        }

                        return {
                            ...item,
                            tokenBalance: (
                                (item.ethBalance === null
                                    ? item.tokenBalance
                                    : item.ethBalance) / 1e18
                            ).toFixed(3), // this pool token balance, vaild or not
                            tokenName: tokenName,
                            NFTName: NFTName,
                            currentPrice: '0000',  //res?.userSellPrice
                            currentBuyPrice: currentBuyPrice,
                            currentSellPrice: currentSellPrice,
                            BondingCurveName: BondingCurveName,
                            poolTypeName: poolTypeName,
                            deltaText: deltaText
                        };
                    });
                    pairsList.sort(function (a, b) {
                        return (b.tokenBalance - a.tokenBalance);
                    });
                    formik.setFieldValue("filterPairs", pairsList);
                    setTempPoolList(pairsList)
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
        <div>
            <div className="max-[800px]:hidden">
                {/*pool type筛选*/}
                <PoolFilter formik={formik} tempPoolList={tempPoolList} needFixPosition={true} />
            </div>

            <div className="flex flex-col items-center bg-base-200 min-h-full	">
                <div className="min-[800px]:w-2/3 max-[799px]:w-5/6 mt-6">
                    <div className="flex justify-center">
                        <button onClick={() => router.push('/collection')} class="btn btn-active" className="bg-[#2ED1D8] text-white rounded-md px-4 py-1 mb-8 mt-4 text-lg">{languageModel.CreateNewPool}</button>
                    </div>
                    {formik.values.filterPairs.length === 0 ? <div className="flex justify-center ">{languageModel.noData}</div> : formik.values.filterPairs?.map((item) => (
                        <PoolCard key={item.id} item={item} formikData={formik} owner={owner} comeFrom="collectionPool" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPool;
