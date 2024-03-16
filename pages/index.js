import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import nextConfig from "../next.config.js";
import styles from "./home/index.module.scss";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        console.log('router', router)
        if (router.asPath === "/#/launchpadList") {
            const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
            if (isProd) {
                window.location.href = 'https://launchpad.ezswap.io/#/launchpadList'
            } else {
                window.location.href = 'https://test.ezswap.io/#/launchpadList'
            }
        } else if (router.asPath.indexOf("/#/launchpad/mint") !== -1) {
            const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
            if (isProd) {
                window.location.href = 'https://launchpad.ezswap.io' + router.asPath
            } else {
                window.location.href = 'https://test.ezswap.io' + router.asPath
            }
        } else {
            // router.replace("/home");
        }
    }, []);

    const [screenWidth, setScreenWidth] = useState();
    useEffect(() => {
        setScreenWidth(window.innerWidth)
    });

    return (
        <div className="min-[1700px]:flex min-[1700px]:flex-col min-[1700px]:items-center">
            <div className={"flex flex-col items-center " + styles.divBackground}>
                <div className="ml-20 min-[1700px]:ml-32  max-[800px]:ml-0">
                    {screenWidth > 800 ?
                        // web
                        <div className="flex items-center mt-20 backdrop-blur-sm">
                            <div className="flex items-center">
                                <img src="/logo256.png" className="w-[200px]" alt=""/>
                                <img className="ml-14 mr-20 max-[800px]:mr-6 max-[800px]:ml-5" src="/bannertiao.png" alt=""/>
                            </div>
                            <div className="text-white">
                                <div className={"min-[1110px]:text-7xl min-[1400px]:text-[5rem] text-6xl font-bold mb-8 max-[800px]:text-3xl min-[1700px]:mr-10 min-[1700px]:text-8xl " + styles.titleStroke}>EZswap Protocol</div>
                                <div className="font-bold text-2xl max-[800px]:text-xl ">
                                    <div>Multi-Chain NFT & Inscription DEX Protocol</div>
                                    <div className="mt-1">The First Gaming & Inscription Assets Market Making</div>
                                    <div className="mt-1">Support ERC 404, ERC 721, ERC 1155</div>
                                </div>
                            </div>
                        </div> :
                        // 移动端
                        <div className="min-[799px]:pl-40 mt-10 backdrop-blur-sm px-10 pt-3">
                            <div className="flex items-center justify-center">
                                <img src="/logo256.png" className="w-[80px]" alt=""/>
                                <img className="ml-14 mr-20 max-[800px]:mr-6 max-[800px]:ml-5 h-[90px]" src="/bannertiao.png" alt=""/>
                                <div className={"text-9xl font-bold max-[800px]:text-4xl text-white " + styles.titleStroke}>EZswap Protocol</div>
                            </div>
                            <div className="text-white mt-6">
                                <div className="font-bold text-2xl max-[800px]:text-xs ">
                                    <div>Multi-Chain NFT & Inscription DEX Protocol</div>
                                    <div className="mt-2">The First Gaming & Inscription Assets Market Making</div>
                                    <div className="mt-2">Support ERC 404, ERC 721, ERC 1155</div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className=" pt-16 max-[800px]:pl-10">
                        <div>
                            <span className="color-[#2ed1d8] font-bold text-4xl">Featured Projects</span>
                            <img className="mt-5 mb-10 max-[800px]:w-[85%]" src="/Vector.png" alt=""/>
                        </div>
                        <div className="flex max-[800px]:flex-col max-[800px]:mr-10">
                            {/*第一个item*/}
                            <div className="bg-black border border-[#737373] rounded-md pt-10 pb-7 text-white min-[799px]:mr-5">
                                {/*最外面上下布局*/}
                                <div className="flex items-center pl-10 pr-10 max-[800px]:pr-1 max-[800px]:pl-5">
                                    {/*里面左右布局*/}
                                    <img className="w-[50px]" src="https://ezonline.s3.us-west-2.amazonaws.com/echo_img2.png" alt=""/>
                                    <div className="ml-8 max-[800px]:ml-5">
                                        <div className="text-4xl font-bold max-[800px]:text-3xl">ECHO 404</div>
                                        <div className="text-sm mt-1 max-[800px]:text-xs">The First EOS EVM Smart Inscription (404)</div>
                                    </div>
                                </div>
                                <div className="flex items-center mt-7 ml-10 mr-10 max-[800px]:ml-5">
                                    <img src="/line1.png" alt=""/>
                                    <div className="ml-3">
                                        <div className="text-[#3ACD37] text-5xl font-bold max-[800px]:text-3xl"><span className="mr-1">+</span>330%</div>
                                        <div className="text-[7px] text-center text-[#9B9B9B] mt-2">ATH since Launch</div>
                                    </div>
                                </div>
                            </div>
                            {/*第一个item*/}
                            <div className="bg-black border border-[#737373] rounded-md pt-10 pb-7 text-white max-[800px]:mt-7 min-[799px]:mr-5">
                                {/*最外面上下布局*/}
                                <div className="flex items-center pl-10 pr-10 max-[800px]:pr-1  max-[800px]:pl-5">
                                    {/*里面左右布局*/}
                                    <img className="w-[50px]" src="https://ezonline.s3.us-west-2.amazonaws.com/marsimage.jpeg" alt=""/>
                                    <div className="ml-8 max-[800px]:ml-5">
                                        <div className="text-4xl font-bold max-[800px]:text-3xl">Mars 404</div>
                                        <div className="text-sm mt-1 max-[800px]:text-xs">Manta 404</div>
                                    </div>
                                </div>
                                <div className="flex items-center mt-7 ml-10 mr-10 max-[800px]:ml-5">
                                    <img src="/line2.svg" alt=""/>
                                    <div className="ml-3">
                                        <div className="text-[#3ACD37] text-5xl font-bold max-[800px]:text-3xl"><span className="mr-1">+</span>4001%</div>
                                        <div className="text-[7px] text-center text-[#9B9B9B] mt-2">ATH since Launch</div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="pt-16 max-[800px]:pl-10 max-w-[1700px]">
                        <div>
                            <span className="color-[#2ed1d8] font-bold text-4xl max-[800px]:text-3xl">Ecosystem</span>
                            <img className="mt-5 mb-10 max-[800px]:w-[85%]" src="/Vector.png" alt=""/>
                        </div>
                        <div className="flex flex-wrap mb-16 max-[800px]:mt-10 gap-10  min-[800px]:mr-20">
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/manta2.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/eos2.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/polygon2.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/zks2.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/arb2.PNG" alt=""/>
                        </div>
                        <div>
                            <span className="color-[#2ed1d8] font-bold text-4xl max-[800px]:text-3xl">Business Partner</span>
                            <img className="mt-5 mb-10 max-[800px]:w-[85%]" src="/Vector.png" alt=""/>
                        </div>
                        <div className="flex flex-wrap mb-32 max-[800px]:mt-10 gap-10 min-[800px]:mr-20">
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9873.PNG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9874.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9875.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9876.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9877.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9878.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9879.PNG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9880.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9881.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9882.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9883.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9884.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9885.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9886.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9887.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9888.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9889.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9890.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9891.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9892.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9893.PNG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9894.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9895.PNG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9896.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9897.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9898.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9899.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9900.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9901.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9902.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9903.JPG" alt=""/>
                            <img className="w-[6%] max-[800px]:w-[20%]" src="/game/IMG_9905.JPG" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
