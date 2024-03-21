import React, {useState, useEffect} from 'react'


const launchpad = () => {


    useEffect(() => {

    })


    return (
        <div className="mt-20 text-white">
            <div className="flex justify-center">
                <div className="mr-16">
                    <img className="rounded-2xl w-[400px]" src="/game/IMG_9873.PNG" alt=""/>
                </div>
                {/*右边*/}
                <div className="w-[40%]">
                    <div className="text-4xl text-bold mb-4">Collection Name</div>
                    <div className="flex items-center  mb-4">
                        <img src="/game/IMG_9873.PNG" className="rounded-full w-[40px]" alt=""/>
                        <span className="mr-4 ml-4">@Creator_Name</span>
                        <a href=""><img src="/website.svg" alt=""/></a>
                        <a className="ml-4" href=""><img src="/Twitter.svg" alt=""/></a>
                    </div>
                    <div>
                        {/*进度条*/}
                        <div>11133</div>
                        <progress className="progress progress-success mb-4 h-[30px] border" value="70" max="100"></progress>
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mattis a diam sit amet pulvinar. Aliquam non lacus purus. Mauris vel tristique turpis. Ut placerat, tellus non condimentum vestibulum, enim velit eleifend lacus, id mattis elit erat eu leo. Vivamus molestie in lorem et finibus. Cras neque est, mollis id tellus at, tristique auctor nisl.
                    </div>
                    <div className="flex justify-between mt-4">
                        {/*    mint按钮*/}
                        <span className="flex items-center">
                                    <img className="w-[13px] h-[13px] mr-1" src="/game/IMG_9873.PNG" alt=""/>
                                    <span>3</span>
                                </span>
                        <button className="bg-[#00D5DA] text-black rounded-xl px-6 py-1 mt-2">Mint</button>
                    </div>
                </div>
            </div>
            {/*时间轴*/}
            <div className="flex justify-center">
                <div className="mt-10 mb-10 block w-[80%]">
                    <ul className="timeline justify-center">
                        <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>white list</div>
                                <div>999/999</div>
                                <div>End</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>
                        <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>white list</div>
                                <div>999/999</div>
                                <div>End</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>
                        <li className="w-[30%]">
                            <hr className="bg-white"/>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="timeline-end ">
                                <div>white list</div>
                                <div>999/999</div>
                                <div>End</div>
                            </div>
                            <hr className="bg-white"/>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default launchpad
