import InputAmount from "@/components/swap/InputAmount";
import NFTSearch from "@/components/swap/NFTSearch";
import SwapButton from "@/components/swap/SwapButton";
import TokenSearch from "@/components/swap/TokenSearch";
import styles from "./index.module.scss";
import {ethers} from "ethers";

import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";

import {useNetwork, useAccount} from "wagmi";

import networkConfig from "../data/networkconfig.json";
import {useLanguage} from "@/contexts/LanguageContext";

const Swap = () => {
    const [swapType, setSwapType] = useState("buy");
    const {languageModel} = useLanguage();

    const formik = useFormik({
        initialValues: {
            // 0   全局变量设置
            golbalParams: "",

            // 1   nft search 要设置成功的 collection , 所有的pairs 和 能交易所的 tokens, 用户拥有的这个nft情况
            collection: {
                type: "",
                address: "",
                name: "",
                tokenId1155: "",
                img: "",
            },
            userCollection: {
                tokenIds721: "",
                tokenAmount1155: "",
                // todo 这个是干啥的
                tokenBalance20: "",
            },
            pairs: "",
            tokens: "",
            tokensName: "",

            // 2 用户点击tokensearch，从canTradeToken中选要换的token  得到能交易的池子
            token: "",
            tokenName: "",
            filterPairs: "",
            swapMode: "",

            //  3
            selectIds: "",
            totalGet: "",
            tupleEncode: "",
            isExceeded: "",
            isBanSelect: "",
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const [isMounted, setIsMounted] = useState(false);

    // 0
    const {chain} = useNetwork();
    const {address: owner} = useAccount();

    // 0 => 1 , reset 2 3
    useEffect(() => {
        setIsMounted(true);
        reset123();
        if (chain) {
            if (chain.id in networkConfig) {
                formik.resetForm();
                formik.setFieldValue("golbalParams", networkConfig[chain.id]);
            }
        }
    }, [chain, owner]);

    const reset123 = () => {
        reset1();
        reset2();
        reset3();
    };

    const reset23 = () => {
        reset2();
        reset3();
    };

    const reset1 = () => {
        formik.setFieldValue("collection", {
            type: "",
            address: "",
            name: "",
            tokenId1155: "",
        });
        formik.setFieldValue("userCollection", {
            tokenIds721: "",
            tokenAmount1155: "",
            tokenBalance20: formik.values.userCollection.tokenBalance20,
        });
        formik.setFieldValue("pairs", "");
        formik.setFieldValue("tokens", "");
        formik.setFieldValue("tokensName", "");
    };

    const reset2 = () => {
        formik.setFieldValue("token", "");
        formik.setFieldValue("tokenName", "");
        formik.setFieldValue("filterPairs", "");
        formik.setFieldValue("swapMode", "");
    };

    const reset3 = () => {
        formik.setFieldValue("selectIds", "");
        formik.setFieldValue("totalGet", "");
        formik.setFieldValue("tupleEncode", "");
        formik.setFieldValue("isExceeded", "");
        formik.setFieldValue("isBanSelect", "");
    };
    const addSwapSuccessCount = () => {
        formik.setFieldValue(
            "swapSuccessCount",
            formik.values.swapSuccessCount + 1
        );
        reset123();
    };

    const handleInputSwapTypeChange = (event) => {
        setSwapType(event.target.value);
        reset123();
    };

    if (!isMounted) {
        return null; //  <Loading /> ??
    }
    return (
        <div className={styles.divBackground}>
            <div className="flex items-center max-[800px]:justify-between min-[800px]:justify-center">
                {/*<span className={styles.leftLine1}></span>*/}
                {/*<span className={styles.leftText}></span>*/}
                {/*<span className={styles.rightText}></span>*/}
                {/*<span className={styles.leftLine2}></span>*/}
                {/*<span className={styles.leftBox1}></span>*/}
                {/*<span className={styles.leftBox1+" "+ styles.rightBox1}></span>*/}
                {/*<span className={styles.rightLine3}></span>*/}

                {/*<span className={styles.rightBias1}></span>*/}
                {/*<span className={styles.leftTopDot1}></span>*/}
                {/*<span className={styles.leftDot1}></span>*/}
                {/*<span className={styles.leftTopBias1}></span>*/}
                {/*<span className={styles.leftTopBias2}></span>*/}
                {/*<span className={styles.leftBias1}></span>*/}
                {/*<span className={styles.leftBias2}></span>*/}
                {/*<span className={styles.leftRightLine1}></span>*/}
                {/*<span className={styles.leftRightLine2}></span>*/}
                {/*<span className={styles.rightLine2}></span>*/}

                <img
                    className="min-[800px]:mr-10 h-[500px]"
                    src="/swap_left.svg"
                    alt=""
                />
                {/* <div className="w-1/3 alert alert-success top-4 right-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Your purchase has been confirmed!</span>
      </div> */}

                {/*className="join-item btn text-[#000000] border-[#00D5DA] bg-[#00D5DA] hover:bg-[#00D5DA]"*/}
                <div className="flex flex-col justify-center items-center">
                    <div className={"w-11/12 max-w-5xl mb-10 join flex justify-center "+ styles.selectButton}>
                        <input
                            className="join-item btn bg-black hover:bg-black checked:!bg-[#00D5DA] checked:!border checked:!border-1 checked:!border-white border border-1 border-white hover:border-white !w-[48%]"
                            type="radio"
                            name="options"
                            value="buy"
                            aria-label={languageModel.Buy}
                            checked={swapType === "buy"}
                            onChange={handleInputSwapTypeChange}
                        />
                        <input
                            className="join-item btn bg-black hover:bg-black checked:!bg-[#00D5DA] checked:!border checked:!border-1 checked:!border-white border border-1 border-white hover:border-white !w-[48%]"
                            type="radio"
                            name="options"
                            value="sell"
                            aria-label={languageModel.Sell}
                            checked={swapType === "sell"}
                            onChange={handleInputSwapTypeChange}
                        />
                    </div>

                    <div className="w-11/12 max-w-5xl card">
                        <div className="card-body">
                            <div className={styles.cardStyle}>
                                <div className="space-y-2 min-w-2/5">
                                    <span className="text-sm font-bold text-white">NFT</span>
                                    <NFTSearch
                                        swapType={swapType}
                                        formikData={formik.values}
                                        owner={owner}
                                        reset123={reset123}
                                        setCollection={(value) => {
                                            formik.setFieldValue("collection", value);
                                        }}
                                        setUserCollection={(value) => {
                                            formik.setFieldValue("userCollection", value);
                                        }}
                                        setPairs={(value) => {
                                            formik.setFieldValue("pairs", value);
                                        }}
                                        setTokens={(value) => {
                                            formik.setFieldValue("tokens", value);
                                        }}
                                        setTokensName={(value) => {
                                            formik.setFieldValue("tokensName", value);
                                        }}
                                        setToken={(value) => {
                                            formik.setFieldValue("token", value);
                                        }}
                                        setTokenName={(value) => {
                                            formik.setFieldValue("tokenName", value);
                                        }}
                                        setFilterPairs={(value) => {
                                            formik.setFieldValue("filterPairs", value);
                                        }}
                                        setSwapMode={(value) => {
                                            formik.setFieldValue("swapMode", value);
                                        }}
                                    />
                                    <InputAmount
                                        swapType={swapType}
                                        formikData={formik.values}
                                        setSelectIds={(value) => {
                                            formik.setFieldValue("selectIds", value);
                                        }}
                                        setTotalGet={(value) => {
                                            formik.setFieldValue("totalGet", value);
                                        }}
                                        setTupleEncode={(value) => {
                                            formik.setFieldValue("tupleEncode", value);
                                        }}
                                        setIsExceeded={(value) => {
                                            formik.setFieldValue("isExceeded", value);
                                        }}
                                        setIsBanSelect={(value) => {
                                            formik.setFieldValue("isBanSelect", value);
                                        }}
                                    />
                                </div>
                            </div>

                            {/*space-y-2 min-w-2/5 mt-8 mb-8 md:w-[300px] w-[240px]*/}
                            <div className="flex justify-center">
                                {/*<hr/>*/}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="36"
                                    height="36"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <polyline points="19 12 12 19 5 12"></polyline>
                                </svg>
                            </div>

                            <div className={`${styles.cardStyle}`}>
                                <div className="mb-4 space-y-2 min-w-2/5">
                                    <div className="text-sm font-bold text-white">{languageModel.Token}</div>
                                    <TokenSearch
                                        swapType={swapType}
                                        formikData={formik.values}
                                        owner={owner}
                                        reset23={reset23}
                                        setToken={(value) => {
                                            formik.setFieldValue("token", value);
                                        }}
                                        setTokenName={(value) => {
                                            formik.setFieldValue("tokenName", value);
                                        }}
                                        setFilterPairs={(value) => {
                                            formik.setFieldValue("filterPairs", value);
                                        }}
                                        setSwapMode={(value) => {
                                            formik.setFieldValue("swapMode", value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.cardStyle}>
                                <SwapButton
                                    swapType={swapType}
                                    formikData={formik.values}
                                    owner={owner}
                                    addSwapSuccessCount={addSwapSuccessCount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <img
                    className="min-[800px]:ml-10 h-[500px]"
                    src="/swap_right.svg"
                    alt=""
                />
            </div>
        </div>
    );
};

export default Swap;
