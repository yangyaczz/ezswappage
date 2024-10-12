import React, { useState, useEffect, useRef } from 'react';
import { BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp } from "@/components/utils/calculate";
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from "../swap/index.module.scss";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import { useContractRead, useBalance } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import { useNetwork, useAccount } from "wagmi";
import multiSetFilterPairMode from "../swap/swapUtils/multiSetFilterPairMode";


function Input1155Sell({ }) {


  const { colInfo, selectedNftTokenIds: selectIds, updateSelectedNftToenIds,
    updateSwapButtonFormikData, swapButtonFormikData, refreshNftListKey, sellSuccessNfts, updateSellSuccessNfts
  } =
    useCollectionInfo();

  const [filterPairs, setFilterPairs] = useState([]);
  const [value, setValue] = useState(0);

  const [golbalParams, setGolbalParams] = useState({})
  const [isLoading, setLoading] = useState(true)
  const { chain } = useNetwork();
  const { address: owner } = useAccount();
  const [max, setMax] = useState(0);
  const [lastMax, setLastMax] = useState(0);


  // useEffect(() => {
  //   setLastMax(max - sellSuccessNfts.length)
  // }, [buySuccessNfts, max])


  useEffect(() => {
    updateSellSuccessNfts([])
  }, [colInfo.address])

  useEffect(() => {
    if (chain) {
      setGolbalParams(networkConfig[chain.id])
    }

  }, [chain, owner]);


  const { refetch, data: tokenAmount1155 } = useContractRead({
    address: colInfo.address,
    abi: ERC1155ABI,
    functionName: "balanceOf",
    args: [owner, colInfo.tokenId1155],
    watch: false,
    enabled: false,
    onSuccess(data) {

      const num = Number(data);
      console.log('1155nft_count', num)
      setMax(num)
      if (num === 0) {
        setLoading(false)
      } else {
        fetchData()
      }

    },

  });
  useEffect(() => {
    setLoading(true)

    refetch();
    return () => {
      updateSelectedNftToenIds([])
    }
  }, [refreshNftListKey, colInfo.address]);


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
          (item) => item.type === "buy" || item.type === "trade"
        );
        if (colInfo.type == "ERC1155") {
          filteredData = filteredData.filter(
            (item) => item.nftId1155 === colInfo.tokenId1155
          );
        }

        if (filteredData.length == 0) {
          setMax(0)
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
            'sell',
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

    // let pairs = JSON.parse(JSON.stringify(paris))
    // selectIds.forEach((id) => {
    //   update1155SellToPairs(id, pairs)
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
    // IdsAmount = IdsAmount - sellSuccessNfts.length
    // if (IdsAmount === 0) {
    //   setMax(0)
    // }
  }

  const setSwapMode = (filterPairs) => {
    console.log('filterPairs', filterPairs)
  }
  const update1155SellToPairs = (tokenId, pairs) => {

    let protocolFee = 10000000000000000   // 0.5%  get from smartcontract
    let dec = 1e18
    let maxPrice = 0
    let maxPriceIndex = -1

    // get pool buy price
    pairs.forEach((pair, index) => {

      let res
      let params = [pair.spotPrice / dec, pair.delta / dec, pair.fee / dec, protocolFee / dec, pair.tokenIds.length + 1]

      if (pair.bondingCurve === 'Linear' && pair.type === 'buy') {
        res = BuyPoolLiner(...params)
      } else if (pair.bondingCurve === 'Linear' && pair.type === 'trade') {
        res = TradePoolLiner(...params)
      } else if (pair.bondingCurve === 'Exponential' && pair.type === 'buy') {
        res = BuyPoolExp(...params)
      } else if (pair.bondingCurve === 'Exponential' && pair.type === 'trade') {
        res = TradePoolExp(...params)
      } else {
        res
      }

      if (res) {
        pair.userGetPrice = res.lastUserSellPrice
        pair.ifUserAddGetPrice = res.userSellPrice

        // get maxPrice pool
        if (pair.tokenBalance / dec * 0.999 >= res.poolBuyPrice) {
          const currentPrice = res.currentUintSellPrice
          if (currentPrice > maxPrice) {
            maxPrice = currentPrice
            maxPriceIndex = index
          }
        }
      }
    })


    if (maxPriceIndex !== -1) {

      pairs[maxPriceIndex].tokenIds.push(tokenId)
      pairs[maxPriceIndex].userGetPrice = pairs[maxPriceIndex].ifUserAddGetPrice
      pairs[maxPriceIndex].tuple = [
        [
          pairs[maxPriceIndex].id,
          [tokenId],
          [pairs[maxPriceIndex].tokenIds.length]
        ],
        ethers.utils.parseEther(pairs[maxPriceIndex].userGetPrice.toString()).mul(ethers.BigNumber.from('995')).div(ethers.BigNumber.from('1000'))
      ]
    } else {
      console.log('nft execced amount')
    }
  }


  useEffect(() => {
    //切换tab 数据还没来得及清空
    if (!(selectIds.length >= 1 && selectIds[0] === undefined)) {
      setValue(selectIds.length)
    }

    updateSwapInfo();

  }, [selectIds])

  const updateSwapInfo = () => {

    ///////////////////////////////////////////////////////////////

    let pairs = JSON.parse(JSON.stringify(filterPairs))

    selectIds.forEach((id) => {
      update1155SellToPairs(id, pairs)
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
    IdsAmount = IdsAmount - sellSuccessNfts.length;
    let isExceeded = false
    // check if is execeeded
    if (selectIds.length > IdsAmount) {
      isExceeded = true
    }
    totalGet = Number(totalGet.toFixed(10));

    updateSwapButtonFormikData({ isExceeded: isExceeded, swapType: 'sell', tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: new Array(selectIds.length).fill(colInfo.tokenId1155) })


  }

  const toggleSelected = (value) => {

    updateSelectedNftToenIds(new Array(value).fill(colInfo.tokenId1155))

    // ///////////////////////////////////////////////////////////////

    // let pairs = JSON.parse(JSON.stringify(filterPairs))

    // newSids.forEach((id) => {
    //   update1155SellToPairs(id, pairs)
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

    // updateSwapButtonFormikData({ isExceeded: false, swapType: 'sell', tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: newSids })

    // setSwapButtonFormikData({ isExceeded: false, tupleEncode: tupleEncode, totalGet: totalGet, collection: { type: colInfo.type, address: colInfo.address }, golbalParams: { router: golbalParams.router }, selectIds: newSids })

    // setTupleEncode(tupleEncode)
    // setTotalGet(totalGet)
    // console.log(totalGet)
    ///////////////////////////////////////////////////////////////

    // check if is execeeded
    // if (newSids.length > IdsAmount) {
    //   setIsExceeded(true)
    // } else {
    //   setIsExceeded(false)
    // }
  }



  // const nftItemClick = (index) => {
  //   if (selectIds.length >= parisMax && !selectIds.includes(index)) {
  //     return
  //   }
  //   let newIndexs = []
  //   if (selectIds.includes(index)) {
  //     newIndexs = selectIds.filter(item => item !== index)
  //   } else {
  //     newIndexs = [...selectIds, index]
  //   }
  //   toggleSelected(newIndexs);
  // }



  const handleChange = (e) => {
    const inputValue = e.target.value;

    // check
    if (/^\d+$/.test(inputValue)) {
      setValue(Math.min(Math.max(1, Number(inputValue)), max));
    } else {
      setValue(0);
    }
  };


  const handleIncrement = () => {
    // 不能超过用户的自己NFT的数量
    setValue(prev => Math.min(prev + 1, max))
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - 1, 0))
  };


  useEffect(() => {
    toggleSelected(value)
  }, [value]);








  if (isLoading) {
    return (
      <div className="text-center mt-10"><p className="h-max loading loading-bars loading-lg"></p></div>
    )
  }

  //////////////////////////////////////////////////////////////////////////////
  // if (max == 0 || !colInfo.tokenId1155) {
  //   return <div>{languageModel.YouDontHaveThisNFT}</div>
  // }


  // return (
  //   <>
  //     <section className="w-full h-[470px] overflow-scroll  border-[1px] border-solid border-[#496C6D] rounded-lg grid grid-rows-[40px,auto] justify-items-stretch">


  //       <BuyNFTsSelectedRange value={selectIds.length} radioRef={radioRef} min={0} max={parisMax} handleRangeChange={(e) => rangeChange(e)} />

  //       <div className="flex flex-wrap  p-5 mt-2">

  //         {
  //           nftList.map((index) => {
  //             return (<div
  //               data-tip="this collection has no liquidity"
  //               key={index} className={'relative border border-[#00D5DA] mr-3 flex flex-col items-center  mt-5 pb-5 rounded-xl ' + (selectIds.length >= parisMax && !selectIds.includes(index) ? 'filter grayscale  tooltip opacity-50' : '')} onClick={() => nftItemClick(index)}>
  //               <img
  //                 src={colInfo.image}
  //                 style={{
  //                   width: `245px`,
  //                 }}
  //               />
  //               <p> #{colInfo.tokenId1155}</p>

  //               {
  //                 selectIds.includes(index) && (
  //                   <svg className="absolute top-5 right-5" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                     <circle cx="14" cy="14" r="14" fill="#00D5DA" />
  //                     <path d="M7.30831 12.6058C7.69163 12.2083 8.32466 12.1967 8.72225 12.58L13.5447 17.2291C13.9423 17.6124 13.9538 18.2455 13.5705 18.6431L12.9563 19.2801C12.573 19.6777 11.94 19.6893 11.5424 19.306L6.71996 14.6569C6.32234 14.2735 6.31078 13.6404 6.69413 13.2428L7.30831 12.6058Z" fill="black" />
  //                     <path d="M19.0995 8.72037C19.481 8.32226 20.1128 8.30814 20.5118 8.6888L21.1517 9.29943C21.5521 9.68145 21.5661 10.316 21.1829 10.7153L12.9649 19.279C12.5827 19.6773 11.9501 19.6906 11.5515 19.3087L10.9184 18.702C10.5196 18.3198 10.5061 17.6868 10.8883 17.288L19.0995 8.72037Z" fill="black" />
  //                   </svg>
  //                 )
  //               }
  //             </div>)
  //           })
  //         }
  //       </div>


  //     </section >
  //   </>
  // );

  return (
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
  )
}

export default Input1155Sell;
