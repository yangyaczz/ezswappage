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

    return (
        <div className={"" + styles.divBackground}>
            <div className="flex items-center px-14 mt-20 backdrop-blur-sm">
                <div className="flex justify-start items-center">
                    <img src="/bannerlogo.png" alt=""/>
                    <img className="ml-10 mr-20" src="/bannertiao.png" alt=""/>
                </div>
                <div className="text-white">
                    <div className={"text-8xl font-bold mb-8 "+styles.titleStroke}>EZswap Protocol</div>
                    <div className="font-bold text-xl">
                        <div>Multi-Chain NFT & Inscription DEX Protocol</div>
                        <div className="mt-1">The First Gaming & Inscription Assets Market Making</div>
                        <div className="mt-1">Support ERC 404, ERC 721, ERC 1155</div>
                    </div>
                </div>
            </div>
            <div className="relative px-14 pt-16">
                <div>
                    <span className="color-[#2ed1d8] font-bold text-5xl">Featured Projects</span>
                    <img className="mt-5 mb-10" src="/Vector.png" alt=""/>
                </div>
                <div className="flex">
                    {/*第一个item*/}
                    <div className="bg-black border border-[#737373] rounded-md px-6 pt-10 pb-5">
                        {/*最外面上下布局*/}
                        <div className="flex items-center">
                            {/*里面左右布局*/}
                            <img width="50px" src="https://ezonline.s3.us-west-2.amazonaws.com/echo_img2.png" alt=""/>
                            <div className="ml-3">
                                <div className="text-4xl font-bold">ECHO 404</div>
                                <div className="text-xs">The First EOS EVM Smart Inscription (404)</div>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <img src="/line1.png" alt=""/>
                            <div className="ml-3">
                                <div className="text-[#3ACD37] text-4xl font-bold">+330%</div>
                                <div className="text-[7px] text-center text-[#9B9B9B] mt-2">ATH since Launch</div>
                            </div>
                        </div>
                    </div>
                    {/*第二个item*/}
                    <div className="bg-black border border-[#737373] rounded-md px-6  pt-10 pb-5 ml-10">
                        {/*最外面上下布局*/}
                        <div className="flex items-center">
                            {/*里面左右布局*/}
                            <img width="50px" src="https://ezonline.s3.us-west-2.amazonaws.com/echo_img2.png" alt=""/>
                            <div className="ml-3">
                                <div className="text-4xl font-bold">Mars</div>
                                <div className="text-xs">The First EOS EVM Smart Inscription (404)</div>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <img src="/line1.png" alt=""/>
                            <div className="ml-3">
                                <div className="text-[#3ACD37] text-4xl font-bold">+4001%</div>
                                <div className="text-[7px] text-center text-[#9B9B9B] mt-2">ATH since Launch</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-14 pt-16">
                <div>
                    <span className="color-[#2ed1d8] font-bold text-5xl">Partners</span>
                    <img className="mt-5 mb-10" src="/Vector.png" alt=""/>
                </div>
                <div className="flex mb-32">
                    <img className="w-1/12 mr-10" src="/polygon-Partner.png" alt=""/>
                    <img className="w-1/12 mr-10" src="/manta-Partner.png" alt=""/>
                    <img className="w-1/12 mr-10" src="/zkh-Partner.png" alt=""/>
                </div>
            </div>
        </div>
    );
};

export default Swap;
