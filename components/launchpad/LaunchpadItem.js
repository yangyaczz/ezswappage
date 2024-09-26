import React, {useEffect, useState} from "react";
import chainIdToInfo from "@/pages/data/chainIdToInfo";
import addressIcon from "@/pages/data/address_icon";
import Link from "next/link";

const LaunchpadItem = ({launchpadItem,step,screenWidth}) => {

    //if (item.jumpType === 1) {
    //         this.$router.push(`/launchpad/mint/${item?.id}`)
    //       } else if (item.jumpType === 2) {
    //         window.open(item.jumpUrl)
    //       }
    return (
        <div>
            <Link href={launchpadItem.jumpType === 1 ? `/launchpaddetail?id=${launchpadItem.id}`:launchpadItem.jumpUrl}>
                <div className="mt-10 card w-[100%] max-[800px]:w-[20rem] bg-base-100 shadow-xl overflow-hidden">
                    <figure className="relative">
                        <img src={launchpadItem.imgUrl} alt="Shoes" className="w-[100%] h-[12rem] object-cover	"/>
                        <div className="flex items-center justify-between absolute bottom-5 w-[100%]">
                            {step ===2?<div className="ml-6">
                                <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1 text-xs font-bold">Mint</button>
                            </div>:<div></div>}
                            <div className="flex mr-6">
                                {(launchpadItem.website !== null && launchpadItem.website !== '') && <a href={launchpadItem.website}><img src="/website.svg" alt=""/></a>}
                                <a className="ml-7 mt-1" href={launchpadItem.twitter}><img src="/Twitter.svg" alt=""/></a>
                            </div>
                        </div>
                    </figure>
                    <div className="flex-auto px-4 py-3 flex flex-row bg-[#1B1A1D] text-white">
                        <div className="w-[57%] max-[800px]:w-[52%]">
                            <div className="flex items-center pb-1">
                                {/*<img className="rounded-full w-[30px]" src="/game/IMG_9873.PNG" alt=""/>*/}
                                <span className="text-base font-bold ">{launchpadItem?.collectionName}</span>
                                {/*<span className="text-base font-bold ">{screenWidth<800? (launchpadItem?.collectionName.length > 12 ? launchpadItem?.collectionName.substring(0, 12) + "..." : launchpadItem?.collectionName):(launchpadItem?.collectionName.length > 20 ? launchpadItem?.collectionName.substring(0, 20) + "..." : launchpadItem?.collectionName)}</span>*/}
                            </div>
                            <div className="mr-6 text-xs">
                                <span>{screenWidth<800?(launchpadItem?.description?.length > 40 ? launchpadItem?.description?.substring(0, 40) + "..." : launchpadItem?.description):(launchpadItem?.description?.length > 60 ? launchpadItem?.description?.substring(0, 60) + "..." : launchpadItem?.description)}</span>
                            </div>
                        </div>
                        {/*右边的说明,上下排列*/}
                        <div className="w-[43%] max-[800px]:w-[48%] text-xs">
                            {/*<div className="flex justify-between border-b border-[#999999]">*/}
                            {/*    <span>Token Name</span>*/}
                            {/*    <span>{launchpadItem.symbol}</span>*/}
                            {/*</div>*/}
                            <div className="flex justify-between border-b border-[#999999]  mt-1">
                                <span>Token Type</span>
                                <span className="font-bold">ERC-{launchpadItem.erc}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]  mt-1">
                                <span>Mint Price</span>
                                <span className="flex items-center">
                                    {(launchpadItem.network !== null && launchpadItem.publicPrice !== null) && <img className="w-[12px] h-[12px] mr-1" src={addressIcon[launchpadItem.network] && addressIcon[launchpadItem.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>}
                                    <span className="font-bold">{launchpadItem.publicPrice === null ? 'N/A':parseInt(launchpadItem.publicPrice) === 0 ?"Free Mint": launchpadItem.publicPrice/1e18}</span>
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999] mt-1">
                                <span>Blockchain</span>
                                <span className="font-bold">{chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName === 'MANTA'? 'Manta':chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName === 'EOS'?'EOS EVM':chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName === 'MATIC' ? 'Polygon':chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName === 'ARB'?'Arbitrum One':chainIdToInfo[parseInt(launchpadItem.network, 16)]?.networkName}</span>
                            </div>
                            {step===2?<div className='flex justify-center'>
                                <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1 mt-3 text-[9px] max-[800px]:text-[9px] font-bold">TRADE ON EZSWAP</button>
                            </div>:<div className="mb-3"></div>}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default LaunchpadItem;
