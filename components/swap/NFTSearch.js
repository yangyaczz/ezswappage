import React, { useState, useEffect } from "react";

import { useContractRead, useBalance } from "wagmi";

import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";

import multiSetFilterPairMode from "./swapUtils/multiSetFilterPairMode";
import styles from "./index.module.scss";
import { useLanguage } from "@/contexts/LanguageContext";
const NFTSearch = ({
    swapType,
    formikData,
    owner,
    reset123,
    setCollection,
    setUserCollection,
    setPairs,
    setTokens,
    setTokensName,
    setToken,
    setTokenName,
    setFilterPairs,
    setSwapMode,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const apiSell = ['mantatest', 'manta', 'ethmain', 'arbmain']
    const { languageModel } = useLanguage();
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredNFTs = formikData.golbalParams.recommendNFT
        ? formikData.golbalParams.recommendNFT.filter(
            (nft) =>
                nft.name.toLowerCase().includes(searchQuery) ||
                nft.address.toLowerCase().includes(searchQuery)
        )
        : [];

    const handleNFTClick = async (nft) => {
        if (formikData.collection.name !== nft.name) {
            reset123();
            setCollection(nft);
        }
    };


    useEffect(() => {
        const fetchSellNFT = async () => {
            // if sell, get user collection detail
            if (formikData.collection.type === "ERC1155" && swapType === "sell") {

                if (formikData.golbalParams.networkName === 'mantatest' || formikData.golbalParams.networkName === 'manta') {
                    let nftAddress = formikData.collection.address;
                    let tid = "0x" + formikData.collection.tokenId1155.toString(16);
                    let parseStr = (nftAddress + "/" + tid + "/" + owner).toLowerCase();

                    const networkType = formikData.golbalParams.networkName;
                    const params = {
                        query: `
                    {
                        erc1155Balances(
                          where: {id: "${parseStr}"}
                        ) {
                          valueExact
                        }
                    }
                    `,
                        urlKey: networkType,
                    };

                    const response = await fetch("/api/queryMantaNFT", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    });
                    const data = await response.json();
                    let num1155 = data?.data?.erc1155Balances[0]?.valueExact;

                    setUserCollection({
                        tokenAmount1155: num1155,
                    });
                } else {
                    let frontText = ''
                    if (formikData.golbalParams.networkName === 'ethmain') {
                        frontText = 'eth-mainnet'
                    } else if (formikData.golbalParams.networkName === 'arbmain') {
                        frontText = 'arb-mainnet'
                    }

                    const params = {
                        url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
                        owner: owner,
                        contractAddress: formikData.collection.address,
                        withMetadata: false,
                        pageSize: 100
                    };

                    const response = await fetch("/api/queryNFTByAlchemy", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    });

                    let data = await response.json();

                    let tokenIdToCheck = formikData.collection.tokenId1155;
                    let matchingNft = data.ownedNfts.find(nft => nft.tokenId === tokenIdToCheck);

                    setUserCollection({
                        tokenAmount1155: matchingNft ? matchingNft.balance : 0,
                    });
                }
            } else if (
                formikData.collection.type === "ERC721" && swapType === "sell"
            ) {

                if (formikData.golbalParams.networkName === 'mantatest' || formikData.golbalParams.networkName === 'manta') {
                    let nftAddress = formikData.collection.address;
                    const networkType = formikData.golbalParams.networkName;
                    const params = {
                        query: `
                    {
                        erc721Tokens(where: { owner: "${owner.toLowerCase()}", contract: "${nftAddress.toLowerCase()}" }) {
                          identifier
                        }
                    }
                    `,
                        urlKey: networkType,
                    };

                    const response = await fetch("/api/queryMantaNFT", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    });
                    const data = await response.json();

                    let ids721 = data?.data?.erc721Tokens.map((id) =>
                        Number(id.identifier)
                    );
                    ids721?.sort(function (a, b) {
                        return a - b;
                    });

                    setUserCollection({
                        tokenIds721: ids721,
                    });
                } else {
                    let frontText = ''
                    if (formikData.golbalParams.networkName === 'ethmain') {
                        frontText = 'eth-mainnet'
                    } else if (formikData.golbalParams.networkName === 'arbmain') {
                        frontText = 'arb-mainnet'
                    }

                    const params = {
                        url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
                        owner: owner,
                        contractAddress: formikData.collection.address,
                        withMetadata: false,
                        pageSize: 100
                    };

                    const response = await fetch("/api/queryNFTByAlchemy", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    });

                    let data = await response.json();

                    const tokenIds = data.ownedNfts.map(nft => nft.tokenId);

                    setUserCollection({
                        tokenIds721: tokenIds,
                    });
                }
            }
        };
        if (formikData.collection.name !== "" && apiSell.includes(formikData.golbalParams.networkName)) {
            fetchSellNFT();
        }
    }, [formikData.collection.name]);

    useEffect(() => {
        const fetchData = async () => {
            if (
                formikData.golbalParams.networkName &&
                formikData.collection.address
            ) {
                const params = {
                    contractAddress: formikData.collection.address,
                    network: formikData.golbalParams.networkName,
                };

                const response = await fetch("/api/proxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });

                const data = await response.json();

                if (data.success) {
                    const pairsList = data.data;

                    let filteredData;
                    // divide buy and sell
                    if (swapType === "sell") {
                        filteredData = pairsList.filter(
                            (item) => item.type === "buy" || item.type === "trade"
                        );
                    } else if (swapType === "buy") {
                        filteredData = pairsList.filter(
                            (item) => item.type === "sell" || item.type === "trade"
                        );
                    }

                    if (formikData.collection.type == "ERC1155") {
                        filteredData = filteredData.filter(
                            (item) => item.nftId1155 === formikData.collection.tokenId1155
                        );
                    }

                    setPairs(filteredData);

                    let canTradeToken = [
                        ...new Set(filteredData.map((item) => item.token)),
                    ].map((token) => (token === null ? "ETH" : token));
                    let permitTokens = formikData.golbalParams.recommendERC20.map(
                        (item) => item.address.toLowerCase()
                    );
                    canTradeToken = canTradeToken.filter((token) =>
                        permitTokens.includes(token.toLowerCase())
                    );

                    setTokens(canTradeToken);

                    const tokensNames = canTradeToken.map((address) => {
                        const mappingObject = formikData.golbalParams.recommendERC20.find(
                            (obj) => obj.address.toLowerCase() === address.toLowerCase()
                        );
                        return mappingObject ? mappingObject.name : null;
                    });

                    setTokensName(tokensNames);

                    if (canTradeToken.length) {
                        let token;
                        if (canTradeToken.includes("ETH")) {
                            token = "ETH";
                            setToken(token);
                            setTokenName("ETH");
                        } else {
                            token = canTradeToken[0];
                            setToken(token);
                            setTokenName(tokensNames[0]);
                        }
                        // setToken(token)
                        // setTokenName(tokensNames[0])

                        multiSetFilterPairMode(
                            swapType,
                            formikData,
                            filteredData,
                            owner,
                            token,
                            setFilterPairs,
                            setSwapMode
                        );
                    }
                }
            }
        };
        fetchData();
    }, [formikData.golbalParams.networkName, formikData.collection.name]);

    // if sell nft, get user nft info
    const { data: tokenIds721 } = useContractRead({
        address: ((formikData.collection.type === "ERC721" && swapType === 'sell' && !apiSell.includes(formikData.golbalParams.networkName)) ? formikData.collection.address : ''),
        abi: ERC721EnumABI,
        functionName: 'tokensOfOwner',
        args: [owner],
        watch: false,
        onSuccess(data) {
            const num = data.map(item => Number(item))
            setUserCollection({
                tokenIds721: num
            })
        }
    })

    const { data: tokenAmount1155 } = useContractRead({
        address: ((formikData.collection.type === "ERC1155" && swapType === 'sell' && !apiSell.includes(formikData.golbalParams.networkName)) ? formikData.collection.address : ''),
        abi: ERC1155ABI,
        functionName: 'balanceOf',
        args: [owner, formikData.collection.tokenId1155],
        watch: false,
        onSuccess(data) {
            const num = Number(data)
            setUserCollection({
                tokenAmount1155: num
            })
        }
    })

    // if buy nft, get user eth or erc20 balance
    const { data: tokenBalance20 } = useBalance({
        address: swapType === "buy" && formikData.collection.name ? owner : "",
        token:
            formikData.token !== "" &&
                formikData.token === "ETH" &&
                swapType === "buy"
                ? ""
                : formikData.token,
        onSuccess(data) {
            // console.log('erc20 balance', data.formatted)
            setUserCollection({
                tokenBalance20: data.formatted,
            });
        },
    });

    return (
        <div className="form-control ">
            <button
                className="justify-start mb-2 text-sm text-white btn md:w-[300px] w-[240px]"
                onClick={() => document.getElementById("nft_search_sell").showModal()}
            >
                {formikData.collection.name
                    ? formikData.collection.name
                    : languageModel.selectCollection}
                <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
                </svg>
            </button>

            <dialog id="nft_search_sell" className="modal">
                <div className={"modal-box" + " " + styles.modalSize}>
                    {/*    <h3 className="text-lg font-bold">Search Collection:</h3>*/}
                    {/*    <div className='input-group'>*/}
                    {/*        <span>*/}
                    {/*            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>*/}
                    {/*        </span>*/}
                    {/*        <input*/}
                    {/*            type="text"*/}
                    {/*            placeholder="NFT Contract Address or Name"*/}
                    {/*            className="w-full input input-bordered"*/}
                    {/*            value={searchQuery}*/}
                    {/*            onChange={handleSearchChange}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*    <div className="divider"></div>*/}
                    <h3 className="mb-6 text-lg font-bold">{languageModel.recommendCollection}:</h3>

                    <form method="dialog" className="flex flex-wrap justify-center">
                        {filteredNFTs.map((nft, index) => (
                            <button key={index} onClick={() => handleNFTClick(nft)}>
                                {/*<div className={"mr-5" + " " + "mb-5" + " " + styles.buttonCenter}>*/}
                                <div
                                    className={
                                        "mr-5 mb-5 flex flex-col items-center justify-center cursor-pointer"
                                    }
                                >
                                    <div className="relative">
                                        {nft.name === formikData.collection.name && (
                                            <img
                                                className="absolute w-6 -left-2 -top-2"
                                                src="/yes.svg"
                                                alt=""
                                            />
                                        )}
                                        <img className="w-[7rem] mb-2" src={nft.img} alt="" />
                                    </div>
                                    <div>{nft.name}</div>
                                </div>
                            </button>
                        ))}
                    </form>
                    <form method="dialog">
                        <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">
                            ✕
                        </button>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>{languageModel.Close}</button>
                </form>
            </dialog>
        </div>
    );
};

export default NFTSearch;
