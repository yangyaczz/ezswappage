import React, {useState, useEffect} from 'react'
import LaunchpadItem from "../../components/launchpad/LaunchpadItem";


const Launchpad = () => {

    const [inComingLaunchpad, setInComingLaunchpad] = useState([]);
    const [endLaunchpad, setEndLaunchpad] = useState([]);
    const [activeLaunchpad, setActiveLaunchpad] = useState([]);

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
                if (launchpadItem.status === 1) {
                    tempIncomingLaunchpad.push(launchpadItem)
                } else if (launchpadItem.status === 2) {
                    tempEndLaunchpad.push(launchpadItem)
                } else if (launchpadItem.status === 3) {
                    tempActiveLaunchpad.push(launchpadItem)
                }
            }
            setInComingLaunchpad(tempIncomingLaunchpad)
            setEndLaunchpad(tempEndLaunchpad)
            setActiveLaunchpad(tempActiveLaunchpad)
        }

    }


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-6xl font-bold mt-20 mb-10">EZSWAP LAUNCHPAD</div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 px-10 w-[90%]">
                {/*整体左右布局*/}
                <div className="flex justify-between">
                    {/*左边的文案*/}
                    <div className="w-[50%]">
                        {/*左边的文案里面整体上下布局*/}
                        <div className="flex">
                            {/*title是左右布局*/}
                            <div>
                                <img className="rounded-xl" width="100px" src="/game/IMG_9873.PNG" alt=""/>
                            </div>
                            <div className="ml-5">
                                {/*标题上下布局*/}
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold">Project Name</span>
                                    <img className="ml-2" src="/website.svg" alt=""/>
                                    <img className="ml-2" src="/Twitter.svg" alt=""/>
                                </div>
                                <div className="flex items-center mt-4 text-base">
                                    <span>2000 items</span>
                                    <span className="flex justify-center items-center ml-4">
                                        <img className="w-[10px] h-[10px] mr-1" src="/game/IMG_9873.PNG" alt=""/>
                                        <span>0.55</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*第二行的正文*/}
                        <div className="mt-4">
                            Description here Description here Description here Description here Description here Description here Description here Description here
                        </div>

                        <button className="rounded-3xl flex items-center bg-[#303030] px-6 py-2 mt-3">
                            <img src="/Ellipse.svg" alt=""/>
                            <span className="font-bold ml-2">Minting Now</span>
                        </button>
                    </div>
                    {/*右边的图片*/}
                    <div>
                        <img className="rounded-xl" src="/game/IMG_9873.PNG" alt=""/>
                    </div>
                </div>
            </div>
            {/*第三块*/}
            <div className="w-[90%]">
                <div className="text-4xl font-bold mt-20">Incoming</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="flex min-[800px]:flex-wrap gap-x-10">
                {inComingLaunchpad.map((item, index) => (
                    <LaunchpadItem key={index} launchpadItem={item}></LaunchpadItem>
                ))}
                </div>
            </div>
            {/*第四块*/}
            <div className="w-[90%]">
                <div className="text-4xl font-bold mt-20">End</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="flex min-[800px]:flex-wrap gap-x-10">
                {endLaunchpad.map((item, index) => (
                    <LaunchpadItem key={index} launchpadItem={item}></LaunchpadItem>
                ))}
                </div>
            </div>
            {/*第五块*/}
            <div className="w-[90%]">
                <div className="text-4xl font-bold mt-20">Active</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="flex min-[800px]:flex-wrap gap-x-10">
                {activeLaunchpad.map((item, index) => (
                    <LaunchpadItem key={index} launchpadItem={item}></LaunchpadItem>
                ))}
                </div>
            </div>

        </div>
    )
}

export default Launchpad
