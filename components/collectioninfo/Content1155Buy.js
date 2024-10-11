import React, { useState, useEffect, useRef } from 'react';
import { SellPoolLiner, TradePoolLiner, SellPoolExp, TradePoolExp, } from "@/components/utils/calculate";
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from "../swap/index.module.scss";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import { useNetwork, useAccount } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import SwapButton from "@/components/swap/SwapButton";
import multiSetFilterPairMode from "../swap/swapUtils/multiSetFilterPairMode";
import BuyNFTsSelectedRange from "@/components/collectioninfo/BuyNFTsSelectedRange";
function Input1155Buy({ }) {

  const { colInfo, selectedNftTokenIds: selectIds, updateSelectedNftToenIds,
    updateSwapButtonFormikData, swapButtonFormikData, refreshNftListKey } =
    useCollectionInfo();

  // const [swapButtonFormikData, setSwapButtonFormikData] = useState({})

  const [value, setValue] = useState(0);
  // const tId = formikData.collection.tokenId1155
  // const tId = ""
  const [max, setMax] = useState(0);
  const { languageModel } = useLanguage();
  //TODO
  const [filterPairs, setFilterPairs] = useState([]);

  const [golbalParams, setGolbalParams] = useState({})
  const [isLoading, setLoading] = useState(true)
  const { chain } = useNetwork();
  const { address: owner } = useAccount();

  const [nftList, setNftList] = useState([])

  useEffect(() => {
    if (chain) {
      setGolbalParams(networkConfig[chain.id])
    }

  }, [chain, owner]);

  useEffect(() => {
    if (colInfo.address) {
      fetchData();

    }
    return () => {
      updateSelectedNftToenIds([])
    }

  }, [colInfo.address, golbalParams, refreshNftListKey])

  const radioRef = useRef(
    0
  );

  const fetchData = async () => {
    if (
      golbalParams.networkName &&
      colInfo.address
    ) {
      setLoading(true)
      const params = {
        contractAddress: colInfo.address,
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

      if (data.success) {
        const pairsList = data.data;

        let filteredData = pairsList.filter(
          (item) => item.type === "sell" || item.type === "trade"
        )
        if (colInfo.type == "ERC1155") {
          filteredData = filteredData.filter(
            (item) => item.nftId1155 === colInfo.tokenId1155
          );
        }

        // setFilterPairs(filteredData);

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

        // const tokensNames = canTradeToken.map((address) => {
        //   const mappingObject = formikData.golbalParams.recommendERC20.find(
        //     (obj) => obj.address.toLowerCase() === address.toLowerCase()
        //   );
        //   return mappingObject ? mappingObject.name : null;
        // });

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
            setPairs,
            setSwapMode
          );
        }
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  };

  const setPairs = (paris) => {
    setFilterPairs(paris);
    let totalNftCount1155 = paris.reduce((sum, item) => sum + item.nftCount1155, 0);
    setMax(totalNftCount1155)
  }
  const setSwapMode = (filterPairs) => {
    console.log('filterPairs', filterPairs)
  }

  // const setFilterPairs = (filterPairs) => {
  //   console.log('filterPairs', filterPairs)
  //   setPairs(filterPairs);
  //   // toggleSelected();
  //   const ids = filterPairs?.map((item) => item.nftIds);
  //   const prices = filterPairs?.map((item) => item.nftIdsPrice);
  //   const idPriceMap = mapIdsToPrices(ids, prices);
  //   setIdPriceMap(idPriceMap);
  //   buildNftList(idPriceMap);

  // }


  const update1155BuyToPairs = (tokenId, pairs) => {
    let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
    let dec = 1e18
    let minPrice = 0
    let minPriceIndex = -1
    // get pool sell price
    pairs.forEach((pair, index) => {

      let res
      let params = [pair.spotPrice / dec, pair.delta / dec, pair.fee / dec, protocolFee / dec, pair.tokenIds.length + 1]

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

      if (res) {
        pair.userGetPrice = res.lastUserBuyPrice
        pair.ifUserAddGetPrice = res.userBuyPrice

        // get max Price pool   // if token enough       pair.nftCount1155 > pair.tokenIds.length
        if (pair.nftCount1155 > pair.tokenIds.length) {
          const currentPrice = res.currentUintBuyPrice

          if (minPrice === 0) {
            minPrice = currentPrice
            minPriceIndex = index
          } else {
            if (currentPrice < minPrice) {
              minPrice = currentPrice
              minPriceIndex = index
            }
          }
        }
      }
    })


    if (minPriceIndex !== -1) {

      pairs[minPriceIndex].tokenIds.push(tokenId)
      pairs[minPriceIndex].userGetPrice = Number((pairs[minPriceIndex].ifUserAddGetPrice * 1.005).toFixed(10))   // 0.5 % slippling
      pairs[minPriceIndex].tuple = [
        [
          pairs[minPriceIndex].id,
          [tokenId],
          [pairs[minPriceIndex].tokenIds.length]
        ],
        ethers.utils.parseEther(pairs[minPriceIndex].userGetPrice.toString())
      ]
    } else {
      console.log('nft execced amount')
    }
  }

  useEffect(() => {

    updateSwapInfo();
    setValue(selectIds.length)

  }, [selectIds])
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // check
    if (/^\d+$/.test(inputValue)) {
      setValue(Math.min(Math.max(0, Number(inputValue)), max));
    } else {
      setValue(0);
    }
  };


  const handleIncrement = () => {
    setValue(prev => Math.min(prev + 1, max))
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - 1, 0))
  };
  useEffect(() => {
    toggleSelected(value)
  }, [value]);

  const updateSwapInfo = () => {
    const newId = new Array(selectIds.length).fill(colInfo.tokenId1155)
    let pairs = JSON.parse(JSON.stringify(filterPairs))

    newId.forEach((id) => {
      update1155BuyToPairs(id, pairs)
    })

    let tupleEncode = []
    let totalGet = 0
    let IdsAmount = 0
    pairs.forEach((pair) => {
      if (pair.tuple) {
        tupleEncode.push(pair.tuple)
        totalGet += pair.userGetPrice
        IdsAmount += pair.tokenIds.length
      }
    })

    totalGet = Number(totalGet.toFixed(10));

    updateSwapButtonFormikData({ isExceeded: false, swapType: 'buy', tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: newId })


  }


  const toggleSelected = (value) => {


    updateSelectedNftToenIds(new Array(value).fill(colInfo.nftId1155))


    ///////////////////////////////////////////////////////////////

    // let pairs = JSON.parse(JSON.stringify(filterPairs))

    // newSids.forEach((id) => {
    //   update1155BuyToPairs(id, pairs)
    // })

    // let tupleEncode = []
    // let totalGet = 0
    // let IdsAmount = 0
    // pairs.forEach((pair) => {
    //   if (pair.tuple) {
    //     tupleEncode.push(pair.tuple)
    //     totalGet += pair.userGetPrice
    //     IdsAmount += pair.tokenIds.length
    //   }
    // })

    // totalGet = Number(totalGet.toFixed(10));

    // updateSwapButtonFormikData({ isExceeded: false, swapType: 'buy', tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: newSids })

    // setTupleEncode(tupleEncode)
    // setTotalGet(totalGet)
    // console.log('totalGet', totalGet)
    // console.log(swapButtonFormikData)
    ///////////////////////////////////////////////////////////////

    // check if is execeeded

    //TODO
    // if (formikData.userCollection.tokenBalance20 < totalGet) {
    //   setIsExceeded(true);
    // } else {
    //   setIsExceeded(false);
    // }
  }





  const rangeChange = (e) => {
    const number = e.target.value / 1;
    let newSids = [];
    if (number === 0) {
      toggleSelected(newSids);
      return;
    }
    if (number < selectIds.length) {
      newSids = selectIds.slice(0, number);
    } else {
      newSids = nftList.slice(0, number)
    }
    toggleSelected(newSids);
    //重新计算价格
  }

  const nftItemClick = (index) => {
    let newIndexs = []
    if (selectIds.includes(index)) {
      newIndexs = selectIds.filter(item => item !== index)
    } else {
      newIndexs = [...selectIds, index]
    }
    toggleSelected(newIndexs);
  }


  // useEffect(() => {
  //   toggleSelected(colInfo.tokenId1155, value)
  // }, [value]);

  if (isLoading) {
    return (
      <div className="text-center mt-10"><p className="h-max loading loading-bars loading-lg"></p></div>
    )
  }




  return (
    <>
      <section className="w-full h-[470px] overflow-scroll  border-[1px] border-solid border-[#496C6D] rounded-lg ">
        <div className="relative border border-[#00D5DA] mr-3 flex flex-col items-center  mt-[40px] pb-5 rounded-xl  w-[245px] ml-[40px]" >
          <img
            src={colInfo.image}
            className='w-full h-[245px]'
          />
          <p >#{colInfo.tokenId1155}</p>
          <div className='flex justify-center items-center relative left-[2px]'>
            <span>{swapButtonFormikData.totalGet?.toFixed(5)}</span>
            <img className="w-5 h-5 block" src="/ETH.png" />
          </div>
          <div className='form-control mt-2'>
            <div className="input-group">
              <button onClick={handleDecrement} className="btn-square rounded-r-none border max-[800px]:w-10  border-white border-white hover:border-white bg-black rounded-l-xl">-</button>
              <input type="text" value={value} onChange={handleChange} className=" max-[800px]:w-14 w-20 rounded-none text-center border-y py-[11px] border-y-white bg-black" />
              <button onClick={handleIncrement} className="btn-square rounded-l-none border max-[800px]:w-10  border-white border-white hover:border-white bg-black rounded-r-xl">+</button>
            </div>
          </div>

          {value > 0 && <svg className="absolute top-8 right-10" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="14" fill="#00D5DA" />
            <path d="M7.30831 12.6058C7.69163 12.2083 8.32466 12.1967 8.72225 12.58L13.5447 17.2291C13.9423 17.6124 13.9538 18.2455 13.5705 18.6431L12.9563 19.2801C12.573 19.6777 11.94 19.6893 11.5424 19.306L6.71996 14.6569C6.32234 14.2735 6.31078 13.6404 6.69413 13.2428L7.30831 12.6058Z" fill="black" />
            <path d="M19.0995 8.72037C19.481 8.32226 20.1128 8.30814 20.5118 8.6888L21.1517 9.29943C21.5521 9.68145 21.5661 10.316 21.1829 10.7153L12.9649 19.279C12.5827 19.6773 11.9501 19.6906 11.5515 19.3087L10.9184 18.702C10.5196 18.3198 10.5061 17.6868 10.8883 17.288L19.0995 8.72037Z" fill="black" />
          </svg>}

        </div>
      </section>
    </>
  );
}

export default Input1155Buy;
