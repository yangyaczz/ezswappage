import React, {useState, useEffect} from 'react'


const Launchpad = () => {


    // useEffect(() => {
    //
    // })


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-6xl font-bold mt-20 mb-10">EZSWAP LAUNCHPAD</div>
            {/*第二块*/}
            <div className="border rounded-3xl py-6 px-10 w-[80%]">
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
            <div className="w-[80%]">
                <div className="text-4xl font-bold mt-20">Incoming</div>
                <div className="border mt-5"></div>
                {/*item*/}
                <div className="border mt-10 rounded-3xl w-[40%] overflow-hidden">
                    <div className="">
                        <img src="/game/IMG_9873.PNG" alt=""/>
                        {/*twitter小图标,网站*/}
                        <div className="flex justify-between mr-4 relative -top-5">
                            <div className="ml-10">
                                <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1">Mint</button>
                            </div>
                            <div className="flex">
                                <a href=""><img src="/website.svg" alt=""/></a>
                                <a className="ml-2" href=""><img src="/Twitter.svg" alt=""/></a>
                            </div>
                        </div>
                    </div>
                    {/*item的正文,左右排列*/}
                    <div className="flex px-6 justify-between items-end bg-white text-black pt-3 pb-6">
                        {/*左边的标题上下排列*/}
                        <div className="w-[60%] pt-3">
                            <div className="flex items-center pb-3">
                                <img className="rounded-full w-[50px]" src="/game/IMG_9873.PNG" alt=""/>
                                <span className="text-2xl font-bold ml-3">Project Name</span>
                            </div>
                            <div>
                                <span>Description here Description here Description here Description here </span>
                            </div>
                        </div>
                        {/*右边的说明,上下排列*/}
                        <div className="w-[40%]">
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Token Name</span>
                                <span>$SBT</span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Token Type</span>
                                <span>ERC-404</span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Mint Price</span>
                                <span className="flex items-center">
                                    <img className="w-[13px] h-[13px] mr-1"  src="/game/IMG_9873.PNG" alt=""/>
                                    <span>3</span>
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-[#999999]">
                                <span>Blockchain</span>
                                <span>Manta</span>
                            </div>
                            <button className="bg-[#00D5DA] text-white rounded-3xl px-6 py-1 mt-2">Trade on EZSWAP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Launchpad
