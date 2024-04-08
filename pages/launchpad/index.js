import React, {useState, useEffect} from 'react'
import LaunchpadItem from "../../components/launchpad/LaunchpadItem";
import addressIcon from "@/pages/data/address_icon";
import Link from "next/link";


const Launchpad = () => {

    const [inComingLaunchpad, setInComingLaunchpad] = useState([]);
    const [endLaunchpad, setEndLaunchpad] = useState([]);
    const [activeLaunchpad, setActiveLaunchpad] = useState([]);
    const [topLaunchpad, setTopLaunchpad] = useState({});

    useEffect(() => {
        queryLaunchpadList()
    },[])

    async function queryLaunchpadList() {
        const params = {};
        const response = await fetch("/api/queryLaunchpadList", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
        });
        const data = await response.json();
        if (data.success) {
            let tempIncomingLaunchpad = [];
            let tempEndLaunchpad = [];
            let tempActiveLaunchpad = [];
            for (const launchpadItem of data.data) {
                if (launchpadItem.status === 0) {
                    tempIncomingLaunchpad.push(launchpadItem)
                } else if (launchpadItem.status === 1) {
                    tempEndLaunchpad.push(launchpadItem)
                } else if (launchpadItem.status === 2) {
                    tempActiveLaunchpad.push(launchpadItem)
                }
                if (launchpadItem.id === 265){
                    setTopLaunchpad(launchpadItem)
                }
            }
            setInComingLaunchpad(tempIncomingLaunchpad)
            setEndLaunchpad(tempEndLaunchpad)
            setActiveLaunchpad(tempActiveLaunchpad)
        }

    }

    useEffect(() => {
        setScreenWidth(window.innerWidth)
    });
    const [screenWidth, setScreenWidth] = useState();
    const widthStyle= {width: screenWidth+'px'}


    return (
        <div className="flex flex-col justify-center items-center mb-20 "  style={widthStyle}>
            <div className="text-6xl font-bold mt-20 mb-10 max-[800px]:text-3xl max-[800px]:mt-10 text-white">EZSWAP LAUNCHPAD</div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 min-[800px]:px-10 max-[800px]:px-3 w-[80%] max-[800px]:w-[90%] text-white">
                {/*整体左右布局*/}
                {screenWidth > 800 ? <div className="flex justify-between max-[800px]:flex-col max-[800px]:flex-col-reverse">
                    {/*左边的文案*/}
                    <div className="min-[800px]:w-[50%]">
                        {/*左边的文案里面整体上下布局*/}
                        <div className="flex">
                            {/*title是左右布局*/}
                            {/*<div>*/}
                            {/*    <img className="rounded-xl" width="100px" src="/game/IMG_9873.PNG" alt=""/>*/}
                            {/*</div>*/}
                            <div className="">
                                {/*标题上下布局*/}
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold max-[800px]:text-2xl">{topLaunchpad.collectionName}</span>
                                    {(topLaunchpad.website !== null && topLaunchpad.website !== '') && <a href={topLaunchpad.website}><img className="ml-2" src="/website.svg" alt=""/></a>}
                                    <a href={topLaunchpad.twitter}><img className="ml-2" src="/Twitter.svg" alt=""/></a>
                                </div>
                                <div className="flex items-center mt-4 text-base font-bold">
                                    <span>{topLaunchpad.totalSupply>=999999999 ? "∞" : topLaunchpad.totalSupply} items</span>
                                    <span className="flex justify-center items-center ml-4 max-[800px]:ml-1">
                                        <img className="w-[22px] h-[22px] mr-1" src={addressIcon[topLaunchpad.network] && addressIcon[topLaunchpad.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>
                                        <span>{topLaunchpad.publicPrice === null ? 'na':parseInt(topLaunchpad.publicPrice) === 0 ?"Free Mint": topLaunchpad.publicPrice/1e18}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*第二行的正文*/}
                        <div className="mt-4">
                            {topLaunchpad.description}
                        </div>

                        <Link href={`/launchpaddetail?id=${topLaunchpad.id}`} className="rounded-3xl flex items-center bg-[#303030] px-6 py-2 mt-6 max-[800px]:mt-3 inline-flex">
                            <img src="/Ellipse.svg" alt=""/>
                            <span className="font-bold ml-2">Minting Now</span>
                        </Link>
                    </div>
                    {/*右边的图片*/}
                    <div>
                        <img className="rounded-xl w-[486px] h-[280px] object-cover	" src={topLaunchpad.imgUrl} alt=""/>
                    </div>
                </div>:
                    // 移动端
                    <div className="flex justify-between max-[800px]:flex-col max-[800px]:flex-col-reverse">
                    {/*左边的文案*/}
                    <div className="min-[800px]:w-[50%]">
                        {/*左边的文案里面整体上下布局*/}
                        <div className="flex">
                            <div>
                                <img className="rounded-xl w-[140px]" src={topLaunchpad.imgUrl} alt=""/>
                            </div>
                            <div className="ml-5">
                                {/*标题上下布局*/}
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold max-[800px]:text-2xl">{topLaunchpad.collectionName}</span>
                                </div>
                                <div className='flex items-center'>
                                    <a href={topLaunchpad.website}><img className="mt-2" src="/website.svg" alt=""/></a>
                                    <a href={topLaunchpad.twitter}><img className="ml-2 mt-2" src="/Twitter.svg" alt=""/></a>
                                </div>
                                <div className="flex items-center mt-2 text-base">
                                    <span>{topLaunchpad.totalSupply>=999999999 ? "∞" : topLaunchpad.totalSupply} items</span>
                                    <span className="flex justify-center items-center ml-2">
                                        <img className="w-[10px] h-[10px] mr-1" src={addressIcon[topLaunchpad.network] && addressIcon[topLaunchpad.network]["0x0000000000000000000000000000000000000000"]?.src} alt=""/>
                                        <span>{topLaunchpad.publicPrice === null ? 'na':parseInt(topLaunchpad.publicPrice) === 0 ?"Free Mint": topLaunchpad.publicPrice/1e18}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*第二行的正文*/}
                        <div className="mt-4">
                            {topLaunchpad.description}
                        </div>

                        <Link href={`/launchpaddetail?id=${topLaunchpad.id}`}  className="rounded-3xl flex items-center bg-[#303030] px-6 py-2 mt-3 inline-flex">
                            <img src="/Ellipse.svg" alt=""/>
                            <span className="font-bold ml-2   text-white">Minting Now</span>
                        </Link>
                    </div>
                </div>}
            </div>
            {/*第五块*/}
            <div className="w-[80%] max-[800px]:w-[90%]">
                <div className="text-4xl font-bold mt-20 text-white">Active</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="min-[800px]:grid min-[800px]:grid-cols-3 min-[800px]:justify-between max-[800px]:flex gap-x-7 max-[800px]:overflow-x-auto">
                    {activeLaunchpad.map((item, index) => (
                        <LaunchpadItem key={index} launchpadItem={item} step={2} screenWidth={screenWidth}></LaunchpadItem>
                    ))}
                </div>
            </div>
            {/*第三块*/}
            <div className="w-[80%] max-[800px]:w-[90%]">
                <div className="text-4xl font-bold mt-20 text-white">Incoming</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="min-[800px]:grid min-[800px]:grid-cols-3 min-[800px]:justify-between max-[800px]:flex gap-x-7 max-[800px]:overflow-x-auto">
                {inComingLaunchpad.map((item, index) => (
                    <LaunchpadItem key={index} launchpadItem={item} step={0} screenWidth={screenWidth}></LaunchpadItem>
                ))}
                </div>
            </div>
            {/*第四块*/}
            <div className="w-[80%] max-[800px]:w-[90%]">
                <div className="text-4xl font-bold mt-20 text-white">End</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="min-[800px]:grid min-[800px]:grid-cols-3 min-[800px]:justify-between max-[800px]:flex gap-x-7 max-[800px]:overflow-x-auto">
                {endLaunchpad.map((item, index) => (
                    <LaunchpadItem key={index} launchpadItem={item} step={1} screenWidth={screenWidth}></LaunchpadItem>
                ))}
                </div>
            </div>

        </div>
    )
}

export default Launchpad
