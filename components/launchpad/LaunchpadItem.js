import React, {useEffect, useState} from "react";
import chainIdToInfo from "@/pages/data/chainIdToInfo";
import addressIcon from "@/pages/data/address_icon";
import Link from "next/link";

const LaunchpadItem = ({launchpadItem}) => {
    return (
        <div>
            <Link href={`/launchpaddetail/${launchpadItem.id}`}>
                <div className="mt-10 card w-[25rem] bg-base-100 shadow-xl border overflow-hidden">
                    <figure className="relative">
                        <img src={launchpadItem.imgUrl} alt="Shoes"/>
                        <div className="flex items-center justify-between absolute bottom-5 w-[100%]">
                            <div className="ml-6">
                                <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1">Mint</button>
                            </div>
                            <div className="flex mr-6">
                                <a href=""><img src="/website.svg" alt=""/></a>
                                <a className="ml-7 mt-1" href=""><img src="/Twitter.svg" alt=""/></a>
                            </div>
                        </div>
                    </figure>
                    <div className="flex-auto px-4 py-3 flex flex-row bg-white text-black">
                        <div className="flex-1">
                            <div className="flex items-center pb-3">
                                {/*<img className="rounded-full w-[30px]" src="/game/IMG_9873.PNG" alt=""/>*/}
                                <span className="text-base font-bold">{launchpadItem?.collectionName.length > 20 ? launchpadItem?.collectionName.substring(0, 20) + "..." : launchpadItem?.collectionName}</span>
                            </div>
                            <div className="mr-6 text-xs">
                                <span>{launchpadItem?.description?.length > 50 ? launchpadItem?.description?.substring(0, 50) + "..." : launchpadItem?.description}</span>
                            </div>
                        </div>
                        {/*右边的说明,上下排列*/}
                        <div className="flex-1 text-xs">
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Token Name</span>
                                <span>{launchpadItem.symbol}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Token Type</span>
                                <span>ERC-{launchpadItem.erc}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Mint Price</span>
                                <span className="flex items-center">
                                    <img className="w-[12px] h-[12px] mr-1" src={addressIcon[launchpadItem.network] && addressIcon[launchpadItem.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>
                                    <span>3</span>
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Blockchain</span>
                                <span>{chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName}</span>
                            </div>
                            <div className='flex justify-center'>
                                <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1 mt-2 text-[10px]">TRADE ON EZSWAP</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default LaunchpadItem;
