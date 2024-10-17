import { useCollectionInfo } from "@/contexts/CollectionInfoContext";
import React, { useEffect, useState } from "react";
import SwapButton from "@/components/swap/SwapButton";
import { useNetwork, useAccount } from "wagmi";
import networkConfig from "../../pages/data/networkconfig.json";
import Image from "next/image";
const ContentBuyCart = () => {
  const { refreshNftList } =
    useCollectionInfo();
  const { chain } = useNetwork();
  const { address: owner } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [golbalParams, setGolbalParams] = useState({})
  const { nftTokenId2PriceMap, selectedNftTokenIds, updateSelectedNftToenIds,
    updateNftToenId2PriceMap, colInfo, swapButtonFormikData, updateBuySuccessNfts,
    updateSellSuccessNfts, sellSuccessNfts,
    buySuccessNfts } =
    useCollectionInfo();

  const [windowHeight, setWindowHeight] = useState(0); // 初始设置为当前窗口高度

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => {
      setWindowHeight(window.innerHeight); // 更新窗口高度
    };

    window.addEventListener('resize', handleResize); // 监听窗口大小变化

    return () => {
      window.removeEventListener('resize', handleResize); // 清理事件监听
    };
  }, []);


  const deleteNft = (tokenId) => {
    if (colInfo.type === 'ERC721') {
      let temp = selectedNftTokenIds.filter(item => tokenId !== item)
      updateSelectedNftToenIds(temp)
    } else {
      updateSelectedNftToenIds([])
    }

  }
  const deleteAll = () => {
    updateSelectedNftToenIds([])
  }
  const addSwapSuccessCount = () => {
    console.log(swapButtonFormikData)
    if (swapButtonFormikData.swapType === 'buy') {
      updateBuySuccessNfts([...buySuccessNfts, ...swapButtonFormikData.selectIds])
    } else {
      updateSellSuccessNfts([...sellSuccessNfts, ...swapButtonFormikData.selectIds])
    }
    setTimeout(() => {
      refreshNftList()
      updateSelectedNftToenIds([])
    }, 2000)
  }
  useEffect(() => {
    if (chain) {
      setGolbalParams(networkConfig[chain.id])
    }
  }, [chain, owner]);

  useEffect(() => {
    setIsClient(true)
  }, [])
  if (!isClient) {
    return <></>

  }

  const totalPrice = selectedNftTokenIds.map(item => nftTokenId2PriceMap[item]).reduce((acc, num) => acc + num, 0);
  return (
    <>
      <div style={{ height: (windowHeight - 126) + 'px' }} className={`flex flex-col relative content-right-buy   pt-0 pb-[150px]    border-solid border-l-[#496C6D] width-transition transition-all duration-500 ease-in-out overflow-x-hidden overflow-y-scroll ` + (selectedNftTokenIds.length > 0 ? ' border-l-[1px] w-96 px-5' : 'w-0')}>
        <div className=" w-full flex leading-[80px] overflow-hidden">
          <div className="flex-1 text-[32px] font-bold">{swapButtonFormikData.swapType === 'buy' ? 'Buy' : 'Sell'} {selectedNftTokenIds.length} NFT</div>

          <button className=" right-5 bottom-2 relative top-5" onClick={() => deleteAll()}>
            <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1484 4.3659H0.851568C0.738024 4.35959 0.624185 4.37375 0.517674 4.40744C0.411163 4.44113 0.314437 4.49357 0.233974 4.56126C0.15351 4.62894 0.091166 4.71031 0.0511151 4.79991C0.0110641 4.8895 -0.00576912 4.98527 0.00174242 5.08078C-0.00576912 5.17629 0.0110641 5.27205 0.0511151 5.36165C0.091166 5.45125 0.15351 5.53261 0.233974 5.6003C0.314437 5.66799 0.411163 5.72043 0.517674 5.75412C0.624185 5.78781 0.738024 5.80197 0.851568 5.79565H1.70139V18.6634C1.70139 19.0426 1.88046 19.4062 2.19921 19.6744C2.51796 19.9425 2.95027 20.0931 3.40105 20.0931H13.599C14.0497 20.0931 14.482 19.9425 14.8008 19.6744C15.1195 19.4062 15.2986 19.0426 15.2986 18.6634V5.79565H16.1484C16.262 5.80197 16.3758 5.78781 16.4823 5.75412C16.5888 5.72043 16.6856 5.66799 16.766 5.6003C16.8465 5.53261 16.9088 5.45125 16.9489 5.36165C16.9889 5.27205 17.0058 5.17629 16.9983 5.08078C17.0058 4.98527 16.9889 4.8895 16.9489 4.79991C16.9088 4.71031 16.8465 4.62894 16.766 4.56126C16.6856 4.49357 16.5888 4.44113 16.4823 4.40744C16.3758 4.37375 16.262 4.35959 16.1484 4.3659ZM6.80035 16.5045C6.74759 16.6598 6.63611 16.7965 6.48277 16.8938C6.32944 16.9911 6.14259 17.0437 5.95052 17.0437C5.75845 17.0437 5.57161 16.9911 5.41827 16.8938C5.26494 16.7965 5.15345 16.6598 5.1007 16.5045V7.92598C5.15345 7.77062 5.26494 7.63395 5.41827 7.53665C5.57161 7.43935 5.75845 7.38672 5.95052 7.38672C6.14259 7.38672 6.32944 7.43935 6.48277 7.53665C6.63611 7.63395 6.74759 7.77062 6.80035 7.92598V16.5045ZM11.8993 16.5045C11.8465 16.6598 11.7351 16.7965 11.5817 16.8938C11.4284 16.9911 11.2415 17.0437 11.0495 17.0437C10.8574 17.0437 10.6706 16.9911 10.5172 16.8938C10.3639 16.7965 10.2524 16.6598 10.1997 16.5045V7.92598C10.2524 7.77062 10.3639 7.63395 10.5172 7.53665C10.6706 7.43935 10.8574 7.38672 11.0495 7.38672C11.2415 7.38672 11.4284 7.43935 11.5817 7.53665C11.7351 7.63395 11.8465 7.77062 11.8993 7.92598V16.5045ZM16.1484 1.50641H11.8993V0.791534C11.895 0.603084 11.804 0.423372 11.6456 0.290092C11.4871 0.156812 11.2735 0.0803204 11.0495 0.0766602H5.95052C5.72513 0.0766602 5.50898 0.151977 5.34961 0.286042C5.19023 0.420107 5.1007 0.601938 5.1007 0.791534V1.50641H0.851568C0.738024 1.50009 0.624185 1.51425 0.517674 1.54794C0.411163 1.58163 0.314437 1.63408 0.233974 1.70176C0.15351 1.76945 0.091166 1.85081 0.0511151 1.94041C0.0110641 2.03001 -0.00576912 2.12577 0.00174242 2.22128C-0.00576912 2.3168 0.0110641 2.41256 0.0511151 2.50215C0.091166 2.59175 0.15351 2.67312 0.233974 2.7408C0.314437 2.80849 0.411163 2.86093 0.517674 2.89462C0.624185 2.92832 0.738024 2.94248 0.851568 2.93616H16.1484C16.262 2.94248 16.3758 2.92832 16.4823 2.89462C16.5888 2.86093 16.6856 2.80849 16.766 2.7408C16.8465 2.67312 16.9088 2.59175 16.9489 2.50215C16.9889 2.41256 17.0058 2.3168 16.9983 2.22128C17.0058 2.12577 16.9889 2.03001 16.9489 1.94041C16.9088 1.85081 16.8465 1.76945 16.766 1.70176C16.6856 1.63408 16.5888 1.58163 16.4823 1.54794C16.3758 1.51425 16.262 1.50009 16.1484 1.50641Z" fill="#00D5DA" />
            </svg>
          </button>

        </div>
        {colInfo.type === 'ERC721' &&
          <div className="flex-1 overflow-y-scroll">
            {
              selectedNftTokenIds.map((tokenId) => {
                return (
                  <div key={tokenId} className='mt-2 flex border-[1px] border-solid border-[#496C6D] rounded-lg pr-2 py-0  overflow-hidden'>
                    <img className='size-[70px] bg-black' src={colInfo.image}></img>
                    <div className={'pl-2 py-2 flex-1 flex ' + (nftTokenId2PriceMap[tokenId] ? 'flex-col items-start' : '  items-center')}>
                      <div className="flex-1 flex  items-center font-bold">#{tokenId}</div>
                      {
                        nftTokenId2PriceMap[tokenId] &&
                        <div className='flex-1 flex  align-center items-center justify-center h-full'>
                          <span>{nftTokenId2PriceMap[tokenId]?.toFixed(5)}</span>
                          <Image
                            src={colInfo.currencyImage.src}
                            alt={colInfo.currencyImage.label}
                            width={28}
                            height={28}
                            className="inline"
                          />
                        </div>
                      }

                    </div>
                    <button className='pr-2' onClick={() => deleteNft(tokenId)}>
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 0C5.58823 0 0 5.58823 0 12.5C0 19.4118 5.58823 25 12.5 25C19.4118 25 25 19.4118 25 12.5C25 5.58823 19.4118 0 12.5 0ZM17.9412 15.7353C18.5294 16.3235 18.5294 17.3529 17.9412 17.9412C17.3529 18.5294 16.3235 18.5294 15.7353 17.9412L12.5 14.7059L9.26471 18.0882C8.67647 18.6765 7.64706 18.6765 7.05882 18.0882C6.76471 17.6471 6.61765 17.3529 6.61765 16.9118C6.61765 16.4706 6.76471 16.0294 7.05882 15.7353L10.2941 12.5L7.05882 9.41177C6.76471 8.97059 6.61765 8.67647 6.61765 8.23529C6.61765 7.79412 6.76471 7.35294 7.05882 7.05882C7.64706 6.47059 8.67647 6.47059 9.26471 7.05882L12.5 10.2941L15.7353 7.05882C16.3235 6.47059 17.3529 6.47059 17.9412 7.05882C18.5294 7.64706 18.5294 8.67647 17.9412 9.26471L14.7059 12.5L17.9412 15.7353Z" fill="#00D5DA" />
                      </svg>

                    </button>
                  </div>
                )

              }
              )
            }
          </div>}
        {colInfo.type === 'ERC1155' &&
          (
            <div className='mt-2 flex border-[1px] border-solid border-[#496C6D] rounded-lg pr-2'>
              <img className='size-[70px] bg-black' src={colInfo.image}></img>
              <div className={'pl-2 py-2 flex-1 flex flex-col items-start'}>
                <div className="font-bold">#{colInfo.tokenId1155}</div>
                {
                  <div className='flex  align-center items-center font-bold'>
                    <span>{swapButtonFormikData.totalGet?.toFixed(5)}</span>
                    <Image
                      src={colInfo.currencyImage.src}
                      alt={colInfo.currencyImage.label}
                      width={28}
                      height={28}
                      className="inline"
                    /></div>
                }

              </div>
              <div className="flex items-center pr-2  font-bold">
                x{selectedNftTokenIds.length}

              </div>
              <button className='pr-2' onClick={() => deleteNft()}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 0C5.58823 0 0 5.58823 0 12.5C0 19.4118 5.58823 25 12.5 25C19.4118 25 25 19.4118 25 12.5C25 5.58823 19.4118 0 12.5 0ZM17.9412 15.7353C18.5294 16.3235 18.5294 17.3529 17.9412 17.9412C17.3529 18.5294 16.3235 18.5294 15.7353 17.9412L12.5 14.7059L9.26471 18.0882C8.67647 18.6765 7.64706 18.6765 7.05882 18.0882C6.76471 17.6471 6.61765 17.3529 6.61765 16.9118C6.61765 16.4706 6.76471 16.0294 7.05882 15.7353L10.2941 12.5L7.05882 9.41177C6.76471 8.97059 6.61765 8.67647 6.61765 8.23529C6.61765 7.79412 6.76471 7.35294 7.05882 7.05882C7.64706 6.47059 8.67647 6.47059 9.26471 7.05882L12.5 10.2941L15.7353 7.05882C16.3235 6.47059 17.3529 6.47059 17.9412 7.05882C18.5294 7.64706 18.5294 8.67647 17.9412 9.26471L14.7059 12.5L17.9412 15.7353Z" fill="#00D5DA" />
                </svg>

              </button>
            </div>)}

        {selectedNftTokenIds.length > 0 &&
          <div className="absolute bottom-5 left-0 right-0 flex  flex-col bg-black bg-opacity-50">
            <div className="flex">
              <div className="flex-1 text-left pl-10 font-bold ">
                Total
              </div>
              <div className="flex-1 text-right pr-10 flex justify-end font-bold">
                <span>{swapButtonFormikData.totalGet?.toFixed(5)}</span>
                <Image
                  src={colInfo.currencyImage.src}
                  alt={colInfo.currencyImage.label}
                  width={28}
                  height={28}
                  className="inline"
                />
              </div>
            </div>

            <SwapButton
              swapType={swapButtonFormikData.swapType}
              btnStyle={'btn btn-circle w-[240px]'}
              boxStyle={'mt-5'}
              formikData={swapButtonFormikData}
              // showPrice={true}
              owner={owner}
              addSwapSuccessCount={addSwapSuccessCount}
            // iconUrl={chain?.iconUrl}
            />
          </div>

        }


        {/* <button className={"btn w-full mt-10  ezBtn ezBtnPrimary !bg-[#00D5DA] " + (selectedNftTokenIds.length === 0 ? "hidden" : '')} >
          <span className="text-black">SWAP</span>
        </button> */}

      </div >
    </>
  )
};

export default ContentBuyCart;