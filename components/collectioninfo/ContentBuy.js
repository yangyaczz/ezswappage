import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import React, { useEffect, useState, useRef } from "react";
import BuyNFTsSelectedRange from "@/components/collectioninfo/BuyNFTsSelectedRange";
import Image from "next/image";
import {
  SellPoolLiner,
  TradePoolLiner,
  SellPoolExp,
  TradePoolExp,
} from "@/components/utils/calculate";
import { ethers } from "ethers";

import { useNetwork, useAccount } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import multiSetFilterPairMode from "../swap/swapUtils/multiSetFilterPairMode";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { isMobile } from '../utils/ezUtils'

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

const ContentBuy = ({ }) => {
  const { colInfo, nftTokenId2PriceMap: idPriceMap, selectedNftTokenIds: selectIds, updateSelectedNftToenIds,
    updateNftToenId2PriceMap: setIdPriceMap, updateSwapButtonFormikData, refreshNftListKey, buySuccessNfts, updateBuySuccessNfts } =
    useCollectionInfo();
  const { languageModel } = useLanguage()
  const [golbalParams, setGolbalParams] = useState({})
  const [isLoading, setLoading] = useState(true)

  const [nftList, setNftList] = useState([]);
  const [lastNftList, setLastNftList] = useState([]);

  const [pairs, setPairs] = useState([])

  const { chain } = useNetwork();
  const { address: owner } = useAccount();

  const [isClient, setIsClient] = useState(false);


  const minBoxHeight = 350;
  const [boxHeght, setBoxHeght] = useState(minBoxHeight)

  useEffect(() => {
    if (!isMobile(navigator.userAgent)) {
      setBoxHeght(Math.max(window.innerHeight - minBoxHeight), minBoxHeight);
      const handleResize = () => {
        setBoxHeght(Math.max(window.innerHeight - minBoxHeight), minBoxHeight);
      };

      window.addEventListener('resize', handleResize); // 监听窗口大小变化

      return () => {
        window.removeEventListener('resize', handleResize); // 清理事件监听
      };
    }
  }, []);



  useEffect(() => {
    updateBuySuccessNfts([])
    setIsClient(true)
  }, [colInfo.address])

  useEffect(() => {
    console.log('buySuccessNfts', buySuccessNfts)
    const list = nftList.filter(item => !buySuccessNfts.includes(item))
    setLastNftList(list)
  }, [buySuccessNfts, nftList])



  useEffect(() => {


  }, [chain]);

  useEffect(() => {
    if (!chain) {
      return

    }
    const network = networkConfig[chain.id];
    setGolbalParams(network)

    fetchData(colInfo.address, network)
    return () => {
      setPairs([])
      updateSelectedNftToenIds([])
      setIdPriceMap({})
    }
  }, [colInfo.address, chain, owner, refreshNftListKey]);

  // useEffect(() => {
  //   debugger
  //   console.log('refresh', refreshNftListKey)
  // }, [refreshNftListKey]);

  const fetchData = async (contractAddress, golbalParams) => {
    if (
      golbalParams.networkName &&
      contractAddress
    ) {
      const params = {
        contractAddress: contractAddress,
        network: golbalParams.networkName,
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      setLoading(false)
      if (data.success) {
        const pairsList = data.data;
        let filteredData = pairsList.filter(
          (item) => item.type === "sell" || item.type === "trade"
        );
        if (colInfo.type == "ERC1155") {
          filteredData = filteredData.filter(
            (item) => item.nftId1155 === golbalParams.collection.tokenId1155
          );
        }


        let canTradeToken = [
          ...new Set(filteredData.map((item) => item.token)),
        ].map((token) => (token === null ? "ETH" : token));
        let permitTokens = golbalParams.recommendERC20.map(
          (item) => item.address.toLowerCase()
        );
        canTradeToken = canTradeToken.filter((token) =>
          permitTokens.includes(token.toLowerCase())
        );

        // setTokens(canTradeToken);

        const tokensNames = canTradeToken.map((address) => {
          const mappingObject = golbalParams.recommendERC20.find(
            (obj) => obj.address.toLowerCase() === address.toLowerCase()
          );
          return mappingObject ? mappingObject.name : null;
        });

        // setTokensName(tokensNames);

        if (canTradeToken.length) {
          let token;
          if (canTradeToken.includes("ETH")) {
            token = "ETH";
            // setToken(token);
            // setTokenName("ETH");
          } else {
            token = canTradeToken[0];
            // setToken(token);
            // setTokenName(tokensNames[0]);
          }
          // setToken(token)
          // setTokenName(tokensNames[0])

          multiSetFilterPairMode(
            'buy',
            { collection: { type: colInfo.type } },
            filteredData,
            owner,
            token,
            setFilterPairs,
            setSwapMode
          );
        }



        // multiSetFilterPairMode(
        //   'buy',
        //   { collection: { type: 'ERC721' } },
        //   filteredData,
        //   owner,
        //   'ETH',
        //   setFilterPairs,
        //   setSwapMode
        // );




      }
    }
  }

  const setFilterPairs = (filterPairs) => {
    console.log('filterPairs', filterPairs)
    setPairs(filterPairs);
    // toggleSelected();
    const ids = filterPairs?.map((item) => item.nftIds);
    const prices = filterPairs?.map((item) => item.nftIdsPrice);
    const idPriceMap = mapIdsToPrices(ids, prices);
    setIdPriceMap(idPriceMap);
    buildNftList(idPriceMap);
    // const pairs = Object.keys(idPriceMap).map(item => { return { price: idPriceMap[item], tokenId: item } }).sort((a, b) => {
    //   const aSelected = selectIds.includes(a);
    //   const bSelected = selectIds.includes(b);
    //   if (aSelected === bSelected) {
    //     return parseFloat(idPriceMap[a]) - parseFloat(idPriceMap[b]);
    //   }
    //   return aSelected ? -1 : 1;
    // })
    // setNftList(pairs)
  }
  const setSwapMode = (filterPairs) => {
    console.log('filterPairs', filterPairs)
  }


  const rangeChange = (e) => {
    const number = e.target.value / 1;
    let newSids = [];
    if (number === 0) {
      updateSelectedNftToenIds(newSids)
      toggleSelected(newSids);
      return;
    }
    if (number < selectIds.length) {
      newSids = selectIds.slice(0, number);
      // updateSelectedNftToenIds(newSelectIds)
    } else {
      newSids = lastNftList.slice(0, number)
      // updateSelectedNftToenIds(nftList.slice(0, number))
    }
    toggleSelected(newSids);
    //重新计算价格
  }

  const radioRef = useRef(
    0
  );

  //从swap 里面复制过来的方法
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
      pair.tuple = [
        [pair.id, pair.tokenIds, [pair.tokenIds.length]],
        ethers.utils.parseEther(pair.userGetPrice.toString()),
      ];
    }
  };


  useEffect(() => {
    updateSwapInfo()
    console.log(selectIds)
  }, [selectIds])

  const updateSwapInfo = () => {
    ///////////////////////////////////////////////////////////////

    let tempPairs = JSON.parse(JSON.stringify(pairs));
    selectIds.forEach((id) => {
      update721BuyToPairs(id, tempPairs);
    });

    // update idPriceMap
    let ids = tempPairs.map((item) => item.nftIds);
    let prices = tempPairs.map((item) => item.nftIdsPrice);

    let idPriceMap = mapIdsToPrices(ids, prices);

    let sc = tempPairs.map((pair) => pair.shoppingCart);
    sc = Object.assign({}, ...sc);

    for (let key in sc) {
      if (sc.hasOwnProperty(key)) {
        idPriceMap[key] = sc[key];
      }
    }
    setIdPriceMap(idPriceMap);

    buildNftList(idPriceMap);



    /////////////////////////////////////////////

    let tupleEncode = [];
    let totalGet = 0;
    tempPairs.forEach((pair) => {
      if (pair.tuple) {
        tupleEncode.push(pair.tuple);
        totalGet += pair.userGetPrice;
      }
    });

    totalGet = Number(totalGet.toFixed(10));


    updateSwapButtonFormikData({ swapType: 'buy', isExceeded: false, tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: selectIds })


    ///////////////////////////////////////////////////////////////

    // check if is execeeded ,if totalGet > user balance
    // if (formikData.userCollection.tokenBalance20 < totalGet) {
    //   setIsExceeded(true);
    // } else {
    //   setIsExceeded(false);
    // }

  }

  const toggleSelected = (id) => {
    // add new id to formikdata
    let newSids = [];
    if (typeof id === 'object') {
      newSids = id;
    } else {
      if (id) {
        if (selectIds.includes(id)) {
          newSids = selectIds.filter((item) => item !== id);
        } else {
          newSids = [...selectIds, id];
        }
      }
    }
    updateSelectedNftToenIds(newSids);

    // ///////////////////////////////////////////////////////////////

    // let tempPairs = JSON.parse(JSON.stringify(pairs));
    // newSids.forEach((id) => {
    //   update721BuyToPairs(id, tempPairs);
    // });

    // // update idPriceMap
    // let ids = tempPairs.map((item) => item.nftIds);
    // let prices = tempPairs.map((item) => item.nftIdsPrice);

    // let idPriceMap = mapIdsToPrices(ids, prices);

    // let sc = tempPairs.map((pair) => pair.shoppingCart);
    // sc = Object.assign({}, ...sc);

    // for (let key in sc) {
    //   if (sc.hasOwnProperty(key)) {
    //     idPriceMap[key] = sc[key];
    //   }
    // }
    // setIdPriceMap(idPriceMap);

    // buildNftList(idPriceMap);



    // /////////////////////////////////////////////

    // let tupleEncode = [];
    // let totalGet = 0;
    // tempPairs.forEach((pair) => {
    //   if (pair.tuple) {
    //     tupleEncode.push(pair.tuple);
    //     totalGet += pair.userGetPrice;
    //   }
    // });

    // totalGet = Number(totalGet.toFixed(10));
    // // updateTupleEncode(tupleEncode);
    // // updateTotalGet(totalGet);

    // updateSwapButtonFormikData({ swapType: 'buy', isExceeded: false, tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: newSids })


    // ///////////////////////////////////////////////////////////////

    // // check if is execeeded ,if totalGet > user balance
    // // if (formikData.userCollection.tokenBalance20 < totalGet) {
    // //   setIsExceeded(true);
    // // } else {
    // //   setIsExceeded(false);
    // // }
  };

  const buildNftList = (idPriceMap) => {
    let nftList = Object.keys(idPriceMap)
      .sort((a, b) => {
        const aSelected = selectIds.includes(a);
        const bSelected = selectIds.includes(b);
        if (aSelected === bSelected) {
          return parseFloat(idPriceMap[a]) - parseFloat(idPriceMap[b]);
        }
        return aSelected ? -1 : 1;
      }).map(item => item)

    setNftList(nftList)
  }

  if (!chain && isClient) {
    return (
      <div className="flex justify-center mt-10 w-full"><ConnectButton /></div>
    )
  }
  if (isLoading) {
    return (
      <div className="text-center mt-10"><p className="h-max loading loading-bars loading-lg"></p></div>
    )
  }

  if (lastNftList.length === 0) {
    return (
      <div className="text-center mt-10"><p>{languageModel.noData}</p></div >
    )
  }
  // h - [${ Math.max(minBoxHeight, boxHeght) }px]  h-[${boxHeght}px]
  return (
    <>
      <div style={{ height: boxHeght + 'px' }} className={`w-full    overflow-y-scroll no-scrollbar  border-[1px] border-solid border-[#496C6D] rounded-lg pb-14`}>
        <BuyNFTsSelectedRange value={selectIds.length} radioRef={radioRef} min={0} max={lastNftList.length} handleRangeChange={(e) => rangeChange(e)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-6 px-5">

          {
            lastNftList.map((square, index) => {
              return (<div key={square} className="relative border border-[#00D5DA] mr-3 flex flex-col items-center  mt-5 pb-5 rounded-xl overflow-hidden" onClick={() => toggleSelected(square)}>
                <img
                  src={colInfo.image}
                  style={{
                    width: `200px`,
                  }}
                />
                <p className="mt-2 font-bold liStyle "> #{square}</p>
                <div className="flex items-center mt-3">
                  <span className="font-bold ml-4">{idPriceMap[square]?.toFixed(5)}  </span>
                  <Image
                    src={colInfo.currencyImage.src}
                    alt={colInfo.currencyImage.label}
                    width={28}
                    height={28}
                    className="inline"
                  />
                </div>
                {
                  selectIds.includes(square) && (
                    <svg className="absolute top-5 right-5" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="14" r="14" fill="#00D5DA" />
                      <path d="M7.30831 12.6058C7.69163 12.2083 8.32466 12.1967 8.72225 12.58L13.5447 17.2291C13.9423 17.6124 13.9538 18.2455 13.5705 18.6431L12.9563 19.2801C12.573 19.6777 11.94 19.6893 11.5424 19.306L6.71996 14.6569C6.32234 14.2735 6.31078 13.6404 6.69413 13.2428L7.30831 12.6058Z" fill="black" />
                      <path d="M19.0995 8.72037C19.481 8.32226 20.1128 8.30814 20.5118 8.6888L21.1517 9.29943C21.5521 9.68145 21.5661 10.316 21.1829 10.7153L12.9649 19.279C12.5827 19.6773 11.9501 19.6906 11.5515 19.3087L10.9184 18.702C10.5196 18.3198 10.5061 17.6868 10.8883 17.288L19.0995 8.72037Z" fill="black" />
                    </svg>
                  )
                }
              </div>)
            })
          }
        </div>


      </div >
    </>
  );
};

export default ContentBuy;
