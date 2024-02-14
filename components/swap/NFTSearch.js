import React, { useState, useEffect } from "react";

import { useContractRead, useBalance } from "wagmi";

import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";

import multiSetFilterPairMode from "./swapUtils/multiSetFilterPairMode";
import styles from "./index.module.scss";
import { useLanguage } from "@/contexts/LanguageContext";
import calculatePoolAllInfo from "../utils/calculatePoolInfo";
import { MaxFiveDecimal, MaxThreeDecimal } from "../utils/roundoff";
import addressSymbol from "@/pages/data/address_symbol";
import networkConfig from "../../pages/data/networkconfig.json";
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
  const apiSell = ["mantatest", "manta", "ethmain", "arbmain"];
  const { languageModel } = useLanguage();
  const [collectionsPrice, setCollectionsPrice] = useState([]);
  const SLIPPING_RATE = 1.005;
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
    let colByPair = {};
    console.log("formikData", formikData);
    // console.log('filteredNFTs', filteredNFTs)
    const fetchPromises = filteredNFTs.map((collection) =>
      queryPoolsOfEachCollection(
        collection.address,
        formikData.golbalParams.networkName,
        collection.type,
        collection.tokenId1155
      ).then((eachCollectionPools) => {
        //if there are pools found, sort the collections by trading pairs and show dynamic data
        if (eachCollectionPools?.length > 0) {
          let { bestUserBuyPrice, bestUserSellPrice, nftCount, TVL, volume } =
            calculatePoolAllInfo(eachCollectionPools, collection.address);
          //just to format the prices to  2 decimals. But no decimal if equals to 0.
          //prettier-ignore
          bestUserBuyPrice = parseFloat((bestUserBuyPrice*SLIPPING_RATE).toFixed(6)).toFixed(MaxFiveDecimal(bestUserBuyPrice*SLIPPING_RATE));
          //prettier-ignore
          bestUserSellPrice = bestUserSellPrice?.toFixed(MaxFiveDecimal(bestUserSellPrice));
          var poolsInfo = {
            bestUserBuyPrice,
            bestUserSellPrice,
            contractAddress: collection.address,
          };
          console.log("poolsInfo", poolsInfo);
          colByPair[collection.address] = poolsInfo;
        }
      })
    );

    // Wait for all promises to resolve
    Promise.all(fetchPromises)
      .then(() => {
        // console.log('colByPaircolByPair', colByPair)
        setCollectionsPrice(colByPair);
        // setIsLoading(() => false);
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
        // setIsLoading(() => false);
      });
  }, [formikData.golbalParams.networkName]);

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

  useEffect(() => {
    const fetchSellNFT = async () => {
      // if sell, get user collection detail
      if (formikData.collection.type === "ERC1155" && swapType === "sell") {
        if (
          formikData.golbalParams.networkName === "mantatest" ||
          formikData.golbalParams.networkName === "manta"
        ) {
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
          let frontText = "";
          if (formikData.golbalParams.networkName === "ethmain") {
            frontText = "eth-mainnet";
          } else if (formikData.golbalParams.networkName === "arbmain") {
            frontText = "arb-mainnet";
          }

          const params = {
            url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
            owner: owner,
            contractAddress: formikData.collection.address,
            withMetadata: false,
            pageSize: 100,
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
          let matchingNft = data?.ownedNfts?.find(
            (nft) => nft.tokenId === tokenIdToCheck
          );

          setUserCollection({
            tokenAmount1155: matchingNft ? matchingNft.balance : 0,
          });
        }
      } else if (formikData.collection.type === "ERC721" && swapType === "sell") {
        if (formikData.collection.name === "echo_old") {
          const params = {
            address: owner,
          };
          const response = await fetch("/api/queryECHOUserHaveToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          const data = await response.json();

          if (data.success) {
            let ids721 = data?.data.map((item) => item.tokenId);
            ids721?.sort(function (a, b) {
              return a - b;
            });
            setUserCollection({
              tokenIds721: ids721,
            });
          }
          // todo 404要改
        } else if (formikData.collection.name === "M404" || formikData.collection.name === "mtest"|| formikData.collection.name === "Mars") {
          const params = {
            ownerAddress: owner.toLowerCase(),
            contractAddress: formikData.collection.address.toLowerCase(),
            mode: formikData.golbalParams.networkName,
          };
          const response = await fetch("/api/queryOwnerNFT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          const data = await response.json();

          if (data.success) {
            let ids721 = data?.data.map((item) => item.tokenId);
            ids721?.sort(function (a, b) {
              return a - b;
            });
            setUserCollection({
              tokenIds721: ids721,
            });
          }
        } else if (
          formikData.golbalParams.networkName === "mantatest" ||
          formikData.golbalParams.networkName === "manta"
        ) {
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
          console.log("paramsparamsparams", params);
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
          let frontText = "";
          if (formikData.golbalParams.networkName === "ethmain") {
            frontText = "eth-mainnet";
          } else if (formikData.golbalParams.networkName === "arbmain") {
            frontText = "arb-mainnet";
          }

          const params = {
            url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
            owner: owner,
            contractAddress: formikData.collection.address,
            withMetadata: false,
            pageSize: 100,
          };

          const response = await fetch("/api/queryNFTByAlchemy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          let data = await response.json();

          const tokenIds = data.ownedNfts.map((nft) => nft.tokenId);

          setUserCollection({
            tokenIds721: tokenIds,
          });
        }
      }
    };
    if (
      (formikData.collection.name !== "" &&
        apiSell.includes(formikData.golbalParams.networkName)) ||
      formikData.collection.name === "echo_old"
    ) {
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
    address:
      formikData.collection.type === "ERC721" &&
      swapType === "sell" &&
      !apiSell.includes(formikData.golbalParams.networkName)
        ? formikData.collection.address
        : "",
    abi: ERC721EnumABI,
    functionName: "tokensOfOwner",
    args: [owner],
    watch: false,
    onSuccess(data) {
      const num = data.map((item) => Number(item));
      setUserCollection({
        tokenIds721: num,
      });
    },
  });

  const { data: tokenAmount1155 } = useContractRead({
    address:
      formikData.collection.type === "ERC1155" &&
      swapType === "sell" &&
      !apiSell.includes(formikData.golbalParams.networkName)
        ? formikData.collection.address
        : "",
    abi: ERC1155ABI,
    functionName: "balanceOf",
    args: [owner, formikData.collection.tokenId1155],
    watch: false,
    onSuccess(data) {
      const num = Number(data);
      setUserCollection({
        tokenAmount1155: num,
      });
    },
  });

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
        className="justify-between mb-2 text-sm text-white btn md:w-[300px] w-[240px] border border-1 border-white hover:border-white"
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
        <div
          className={
            "modal-box bg-black border border-1 border-white " +
            " " +
            styles.modalSize
          }
        >
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
          <h3 className="flex justify-center mb-6 text-lg font-bold ">
            {languageModel.recommendCollection}:
          </h3>
          <div className="border-t-[0.1px] border-white mb-10"></div>
          <form method="dialog" className="flex flex-col">
            {filteredNFTs.map((nft, index) => (
              <button
                className="mb-5 border rounded-lg"
                key={index}
                onClick={() => handleNFTClick(nft)}
              >
                {/*<div className={"mr-5" + " " + "mb-5" + " " + styles.buttonCenter}>*/}
                <div
                  className={
                    "ml-4 mb-3 mt-3 cursor-pointer grid grid-cols-1 gap-2 place-items-start sm:grid-cols-2 sm:grid-rows-2 md:gap-4 lg:grid-cols-[1fr,3fr,3fr,3fr] lg:grid-rows-1 gap-x-4 whitespace-nowrap items-center"
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
                    <img
                      className="min-w-[4rem] lg:min-w-[4rem] max-[800px]:w-[4rem] h-[4rem]"
                      src={nft.img}
                      alt=""
                    />
                  </div>
                  <div className="font-bold text-white">
                    {nft.name.length > 15
                      ? nft.name.substring(0, 15) + "..."
                      : nft.name}
                  </div>
                  <div className="font-bold">
                    Floor Price:{" "}
                    {collectionsPrice[nft.address] === undefined
                      ? 0
                      : collectionsPrice[nft.address].bestUserBuyPrice}{" "}
                    {addressSymbol[formikData.golbalParams.hex]?.[
                      "0x0000000000000000000000000000000000000000"
                    ] || "(UNKNOWN)"}
                  </div>
                  <div className="font-bold">
                    Top Bid:{" "}
                    {collectionsPrice[nft.address] === undefined
                      ? 0
                      : collectionsPrice[nft.address].bestUserSellPrice}{" "}
                    {addressSymbol[formikData.golbalParams.hex]?.[
                      "0x0000000000000000000000000000000000000000"
                    ] || "(UNKNOWN)"}
                  </div>
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
