import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import Router from "next/router";

const AirdropClaim = () => {

  const claimStartTimestamp = 1705492800;
  const claimStartTime = new Date(claimStartTimestamp * 1000); //convert to miliseconds
  // const claimStartTime=new Date(2024, 0, 13, 11, 22, 0, 0);;
  const claimEndTimestamp = 1706623200;
  const claimEndTime = new Date(claimEndTimestamp * 1000); //convert to miliseconds
  // const claimEndTime = new Date(2024, 0, 14, 12, 34, 30, 0);

  const { address: owner } = useAccount();
  const [screenWidth, setScreenWidth] = useState();

    useEffect(() => {
        setScreenWidth(window.innerWidth)
    });

  function jumpPage(jumpTo) {
    if (jumpTo === 1){
      Router.push({
        pathname: "/swap",
      });
    }else{
      Router.push({
        pathname: "/collection",
      });
    }
  }

  const widthStyle= {width: screenWidth+'px'}


  return (
    <div className={"w-full flex flex-col justify-center items-center " + styles.divBackground}>
      <div className={`flex flex-col justify-center items-center font-bold `} style={widthStyle}>
        <div className="text-4xl text-[#00D5DA] mb-7 max-[800px]:text-3xl max-[800px]:mt-10">EARN $EZSWAP</div>
        <div className="text-white mb-1 max-[800px]:mr-10 max-[800px]:ml-10">Season 2 of EZswap Protocol Airdrop is LIVE</div>
        <div className="text-white max-[800px]:mr-10 max-[800px]:ml-10">All Season 1 Airdrop will be kept and can be claimed when Season 2 ends</div>

        <div className="carousel w-full text-white mt-14">
          <div id="slide1" className="carousel-item relative w-full ">
              <div className="flex justify-center items-center w-full overflow-hidden	">
                  <a href="#slide4" className="btn btn-circle mr-10 text-xl">❮</a>
                  <div className=" flex flex-col items-center justify-center">
                    <div className="mb-2"><img src="/claimswapnft.svg" alt=""/></div>
                    <div className="text-2xl mb-2 max-[800px]:text-xl">Swap NFTs</div>
                    <div className="max-[800px]:text-sm">Tips for earning $EZSWAP:</div>
                    <div className="mt-10 flex flex-col items-center justify-center">
                      <ul className="flex flex-col justify-start items-start">
                        <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                          <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                          Only use EZswap protocol to swap</li>
                        <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                          <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                          Only recommended collections count</li>
                        <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                          <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                          The more you swap, the more you earn</li>
                        <li className="mb-10 flex justify-center items-center max-[800px]:text-xs">
                          <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                          All supported chains count</li>
                      </ul>
                        <button className={"btn md:w-[300px] w-[240px] max-[800px]:mb-20 " + styles.buttonStyle} onClick={() => jumpPage(1)}>
                            START SWAP
                        </button>
                    </div>
                  </div>
                  <a href="#slide2" className="btn btn-circle ml-10 text-xl">❯</a>
              </div>
          </div>
            {/*第二页*/}
              <div id="slide2"  className="carousel-item relative w-full">
                  <div className="flex justify-center items-center w-full overflow-hidden	">
                      <a href="#slide1" className="btn btn-circle mr-10 text-xl">❮</a>
                      <div className=" flex flex-col items-center justify-center">
                          <div className="mb-2"><img src="/claimlist.svg" alt=""/></div>
                          <div className="text-2xl mb-2 max-[800px]:text-xl">List NFTs</div>
                          <div className="max-[800px]:text-sm">Tips for earning $EZSWAP:</div>
                          <div className="mt-10 flex flex-col items-center justify-center">
                              <ul className="flex flex-col justify-start items-start">
                                  <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                      <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                      Only use EZswap protocol to list</li>
                                  <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                      <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                      Only recommended collections count</li>
                                  <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                      <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                      The more you list, the more you earn</li>
                                  <li className="mb-10 flex justify-center items-center max-[800px]:text-xs">
                                      <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                      Listings closer to floor helps</li>
                              </ul>
                              <button className={"btn md:w-[300px] w-[240px] max-[800px]:mb-20 " + styles.buttonStyle} onClick={() => jumpPage(2)}>
                                  START LISTING
                              </button>
                          </div>
                      </div>
                      <a href="#slide3" className="btn btn-circle ml-10 text-xl" >❯</a>
                  </div>
              </div>
            {/*/!*第三页*!/*/}
            <div id="slide3" className="carousel-item relative w-full">
                <div className="flex justify-center items-center w-full overflow-hidden	">
                    <a href="#slide2" className="btn btn-circle mr-10 text-xl" >❮</a>
                    <div className=" flex flex-col items-center justify-center">
                        <div className="mb-2"><img src="/claimbids.svg" alt=""/></div>
                        <div className="text-2xl mb-2 max-[800px]:text-xl">Bids on NFTs</div>
                        <div className="max-[800px]:text-sm">Tips for earning $EZSWAP:</div>
                        <div className="mt-10 flex flex-col items-center justify-center">
                            <ul className="flex flex-col justify-start items-start">
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Only use EZswap protocol to bid</li>
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Only recommended collections count</li>
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    The more you bid, the more you earn</li>
                                <li className="mb-10 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Bidding closer to floor helps</li>
                            </ul>
                            <button className={"btn md:w-[300px] w-[240px] max-[800px]:mb-20 " + styles.buttonStyle} onClick={() => jumpPage(2)}>
                                START BIDDING
                            </button>
                        </div>
                    </div>
                    <a href="#slide4" className="btn btn-circle ml-10 text-xl" >❯</a>
                </div>
            </div>
            {/*/!*第四页*!/*/}
            <div id="slide4" className="carousel-item relative w-full">
                <div className="flex justify-center items-center w-full overflow-hidden	">
                    <a href="#slide3" className="btn btn-circle mr-10 text-xl">❮</a>
                    <div className=" flex flex-col items-center justify-center">
                        <div className="mb-2"><img src="/claimliqutity.svg" alt=""/></div>
                        <div className="text-2xl mb-2 max-[800px]:text-xl">Add Liquidity on NFTs</div>
                        <div className="max-[800px]:text-sm">Tips for earning $EZSWAP:</div>
                        <div className="mt-10 flex flex-col items-center justify-center">
                            <ul className="flex flex-col justify-start items-start">
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Only use EZswap protocol to add liquidity</li>
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Only recommended collections count</li>
                                <li className="mb-3 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    The more you dd, the more you earn</li>
                                <li className="mb-10 flex justify-center items-center max-[800px]:text-xs">
                                    <div className="w-2 h-2 rounded-md bg-white mr-2"></div>
                                    Trading Volume Matters</li>
                            </ul>
                            <button className={"btn md:w-[300px] w-[240px] max-[800px]:mb-20 " + styles.buttonStyle} onClick={() => jumpPage(2)}>
                                START ADDING
                            </button>
                        </div>
                    </div>
                    <a href="#slide1" className="btn btn-circle ml-10 text-xl">❯</a>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AirdropClaim;
