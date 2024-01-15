import React, {useState, useEffect} from "react";

import networkConfig from "../data/networkconfig.json";
import {
    useNetwork,
    useContractWrite,
    useWaitForTransaction,
    useAccount,
} from "wagmi";
import {useFormik} from "formik";

import {
    BuyPoolLiner,
    TradePoolLiner,
    BuyPoolExp,
    TradePoolExp,
} from "../../components/utils/calculate";
import PoolCard from "@/components/mypool/PoolCard";
import PoolFilter from "@/components/mypool/PoolFilter";
import {useRouter} from "next/router";
import {useLanguage} from "@/contexts/LanguageContext";

const MyPool = () => {
    const {languageModel} = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tempPoolList, setTempPoolList] = useState([]);
    const router = useRouter()

    const {chain} = useNetwork();
    const {address: owner} = useAccount();

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
                    pairsList.sort(function (a, b) {
                        return (b.tokenBalance - a.tokenBalance);
                    });
                    // console.log('pairsList', pairsList)
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
                <PoolFilter formik={formik} tempPoolList={tempPoolList} needFixPosition={true}/>
            </div>
            {/*<div>*/}
            {/*    /!*移动端的筛选*!/*/}
            {/*    <details className="dropdown fixed left-2 top-60 width-7/12 min-[799px]:hidden">*/}
            {/*        <summary className="m-1 btn"><img className="w-5" src="/filter.svg" alt=""/></summary>*/}
            {/*        <div className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">*/}
            {/*            <PoolFilter formik={formik} tempPoolList={tempPoolList}  needFixPosition={false}/>*/}
            {/*        </div>*/}
            {/*    </details>*/}
            {/*</div>*/}
            <div className="flex flex-col items-center bg-base-200">
                <div className="min-[800px]:w-2/3 max-[799px]:w-5/6 mt-6">
                    <div className="flex justify-center">
                        <button onClick={() => router.push('/collection')} class="btn btn-active" className="bg-[#2ED1D8] text-white rounded-md px-4 py-1 mb-8 mt-4 text-lg">{languageModel.CreateNewPool} </button>
                    </div>
                    {formik.values.filterPairs.length === 0 ? <div className="flex justify-center ">{languageModel.noData}</div> : formik.values.filterPairs?.map((item) => (
                        <PoolCard key={item.id} item={item} formikData={formik} owner={owner} comeFrom="myPool"/>
                    ))}
                </div>
            </div>
        </div>
)
    ;
};

export default MyPool;
