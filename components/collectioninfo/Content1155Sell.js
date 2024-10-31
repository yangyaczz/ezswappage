import React, { useState, useEffect, useRef } from 'react';
import { BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp } from "@/components/utils/calculate";
import { ethers } from 'ethers';
import Image from "next/image";
import { useLanguage } from '@/contexts/LanguageContext';
import styles from "../swap/index.module.scss";
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import { useContractRead, useBalance } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import { useNetwork, useAccount } from "wagmi";
import multiSetFilterPairMode from "../swap/swapUtils/multiSetFilterPairMode";
import CollectionData from "../../pages/data/collection-data.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Input1155Sell({ }) {


  const { colInfo, selectedNftTokenIds: selectIds, updateSelectedNftToenIds,
    updateSwapButtonFormikData, swapButtonFormikData, refreshNftListKey, sellSuccessNfts, updateSellSuccessNfts
  } =
    useCollectionInfo();

  const [filterPairs, setFilterPairs] = useState([]);
  const [value, setValue] = useState(0);

  const [golbalParams, setGolbalParams] = useState({})
  const [isLoading, setLoading] = useState(false)
  const { chain } = useNetwork();
  const { address: owner } = useAccount();
  const [max, setMax] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true)
    reset()
    return () => {
      reset()
    }
  }, [colInfo.address])

  const reset = () => {
    updateSellSuccessNfts([])
    updateSelectedNftToenIds([])
  }

  // useEffect(() => {
  //   if (chain) {
  //     setGolbalParams(networkConfig[chain.id])
  //   }

  // }, [chain, owner]);


  const { refetch, data: tokenAmount1155 } = useContractRead({
    address: colInfo.address,
    abi: ERC1155ABI,
    functionName: "balanceOf",
    args: [owner, colInfo.tokenId1155],
    watch: false,
    enabled: false,
    onSuccess(data) {
      const num = Number(data);
      setMax(num)
    },

  });



  // useEffect(() => {

  //   return () => {
  //     updateSelectedNftToenIds([])
  //   }
  // }, [refreshNftListKey, colInfo.address]);

  useEffect(() => {
    const collection = CollectionData.find(item => item.address == colInfo.address)
    if (!chain) {
      return
    }
    reset();
    const network = networkConfig[chain.id];
    setGolbalParams(network)
    // setCollectionName(collection)
    const swapType = 'sell'
    const fetchSellNFT = async (golbalParams) => {
      setLoading(true)
      const collection = CollectionData.find(item => item.address == colInfo.address)

      // if sell, get user collection detail
      if (colInfo.type === "ERC1155" && swapType === "sell") {
        if (
          golbalParams.networkName === "mantatest" ||
          golbalParams.networkName === "manta"
        ) {
          let nftAddress = collection.address;
          let tid = "0x" + collection.tokenId1155.toString(16);
          let parseStr = (nftAddress + "/" + tid + "/" + owner).toLowerCase();

          const networkType = golbalParams.networkName;
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
          const num = num1155 ? num1155.length : 0
          setMax(num)
          // setUserCollection({
          //   tokenAmount1155: num1155,
          // });
        } else {
          refetch()
          // let frontText = "";
          // if (golbalParams.networkName === "ethmain") {
          //   frontText = "eth-mainnet";
          // } else if (golbalParams.networkName === "arbmain") {
          //   frontText = "arb-mainnet";
          // }

          // const params = {
          //   url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
          //   owner: owner,
          //   contractAddress: collection.address,
          //   withMetadata: false,
          //   pageSize: 100,
          // };

          // const response = await fetch("/api/queryNFTByAlchemy", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(params),
          // });

          // let data = await response.json();

          // let tokenIdToCheck = collection.tokenId1155;
          // let matchingNft = data?.ownedNfts?.find(
          //   (nft) => nft.tokenId === tokenIdToCheck
          // );

          // setMax(matchingNft ? matchingNft.balance : 0)

          // setUserCollection({
          //   tokenAmount1155: matchingNft ? matchingNft.balance : 0,
          // });
        }
      }
      // else if (collection.type === "ERC721" && swapType === "sell") {
      //   if (collection.name === "echo_old") {
      //     const params = {
      //       address: owner,
      //     };
      //     const response = await fetch("/api/queryECHOUserHaveToken", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(params),
      //     });

      //     const data = await response.json();

      //     if (data.success) {
      //       let ids721 = data?.data.map((item) => item.tokenId);
      //       ids721?.sort(function (a, b) {
      //         return a - b;
      //       });
      //       setNftList(ids721)
      //     }
      //     // todo 404要改
      //   } 
      // else if (collection.name === "M404" || collection.name === "mtest" || collection.name === "Mars") {
      //   const params = {
      //     ownerAddress: owner.toLowerCase(),
      //     contractAddress: collection.address.toLowerCase(),
      //     mode: golbalParams.networkName,
      //   };
      //   const response = await fetch("/api/queryOwnerNFT", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(params),
      //   });

      //   const data = await response.json();

      //   if (data.success) {
      //     let ids721 = data?.data.map((item) => item.tokenId);
      //     ids721?.sort(function (a, b) {
      //       return a - b;
      //     });
      //     setMax(ids721.length)

      //   }
      // }
      //  else if (
      //   golbalParams.networkName === "mantatest" ||
      //   golbalParams.networkName === "manta"
      // ) {
      //   let nftAddress = collection.address;
      //   const networkType = golbalParams.networkName;
      //   const params = {
      //     query: `
      //             {
      //                 erc721Tokens(where: { owner: "${owner.toLowerCase()}", contract: "${nftAddress.toLowerCase()}" }) {
      //                   identifier
      //                 }
      //             }
      //             `,
      //     urlKey: networkType,
      //   };
      //   console.log("paramsparamsparams", params);
      //   const response = await fetch("/api/queryMantaNFT", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(params),
      //   });
      //   const data = await response.json();

      //   let ids721 = data?.data?.erc721Tokens.map((id) =>
      //     Number(id.identifier)
      //   );
      //   ids721?.sort(function (a, b) {
      //     return a - b;
      //   });
      //   setNftList(ids721)

      // } 
      else {
        refetch()
        // let frontText = "";
        // if (golbalParams.networkName === "ethmain") {
        //   frontText = "eth-mainnet";
        // } else if (golbalParams.networkName === "arbmain") {
        //   frontText = "arb-mainnet";
        // }

        // const params = {
        //   url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
        //   owner: owner,
        //   contractAddress: collection.address,
        //   withMetadata: false,
        //   pageSize: 100,
        // };

        // const response = await fetch("/api/queryNFTByAlchemy", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(params),
        // });

        // let data = await response.json();

        // const tokenIds = data.ownedNfts.map((nft) => nft.tokenId);

        // setMax(tokenIds.length)
      }
      // }
    };
    // if (
    //   (collection.name !== "" &&
    //     apiSell.includes(golbalParams.networkName)) ||
    //   collection.name === "echo_old"
    // ) {
    if (colInfo.address) {
      fetchSellNFT(network);
    }

    // }
  }, [colInfo.address, owner, chain, refreshNftListKey]);

  useEffect(() => {
    fetchData()
  }, [max])

  const radioRef = useRef(
    0
  );

  const fetchData = async () => {
    if (
      golbalParams.networkName &&
      colInfo.address
    ) {
      // setLoading(true)
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
      // setLoading(false)
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
    <section className="w-full h-[470px] ">
      <div className="relative border border-[#00D5DA] mr-3 flex flex-col items-center  mt-[40px] pb-5 rounded-xl  w-[245px] ml-[40px] overflow-hidden" >
        <img
          src={colInfo.image}
          className='w-full h-[245px]'
        />
        <p className='mt-2 font-bold'>#{colInfo.tokenId1155}</p>
        <div className='flex justify-center items-center relative left-[2px]'>
          <span>{swapButtonFormikData.totalGet?.toFixed(5)}</span>
          <Image
            src={colInfo.currencyImage.src}
            alt={colInfo.currencyImage.label}
            width={28}
            height={28}
            className="inline"
          />
        </div>
        <div className='form-control mt-5 liStyle'>
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
