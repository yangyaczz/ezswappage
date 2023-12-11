import React, {useEffect, useState} from 'react'
import {ConnectButton} from '@rainbow-me/rainbowkit'
import styles from './index.module.scss'
import Link from "next/link";
import {useAccount, useContractRead} from "wagmi";
import nextConfig from "../../next.config.js";
import EZSwapPioneer from "../../pages/data/ABI/EZSwapPioneer.json";

const NavBar = () => {

    const [addressInfo, setAddressInfo] = useState({});
    const [sendGetScore, setSendGetScore] = useState(0);
    const [userHavePoineerCount, setUserHavePoineerCount] = useState(0);
    const { address: owner } = useAccount();

    // const {data: nftApprovalData} = useContractRead({
    //     address: '0x670d854c7da9e7fa55c1958a1aeb368b48496020',
    //     abi: EZSwapPioneer,
    //     functionName: 'balanceOf',
    //     args: [owner],
    //     watch: true,
    //     onSuccess(data) {
    //         console.log('查询pass卡:', data)
    //         setUserHavePoineerCount(data.toNumber())
    //     },
    //     onError(err) {
    //         console.log(err, owner)
    //     }
    // })

    useEffect(() => {
        const fetchData = async () => {
            const params = {
                address: owner?.toLowerCase(),
            };
            const response = await fetch("/api/queryAddressScore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (data.success) {
                let userScore = data.data;
                setAddressInfo(userScore)
            }
        }
        fetchData();
    },[owner])

    const svgSuccess = (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)

    const [alertText, setAlertText] = useState({
        className: '',
        text: '',
        svg: '',
    })
    const [showAlert, setShowAlert] = useState(false);
    function showSuccessAlert(msg) {
        setAlertText({
            className: 'alert-success',
            text: msg,
            svg: svgSuccess,
        })
        setShowAlert(true);
    }
    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showAlert]);

    const handleClick = async (item) => {
        if (item === 1) {
            if (addressInfo.todayPunch === 1){
                return
            }
            window.open('https://twitter.com/intent/tweet?text=Today marks day '+(addressInfo.punchCount+1)+' of my daily attendance for EZswap. Get ur $EZ here: https://ezswap.io/%23/event/airdropOverview?inviteAddress=' + owner, '_blank')
            // 打卡
            const params = {address: owner?.toLowerCase()};
            const response = await fetch("/api/addressPunch", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (data.success) {
                showSuccessAlert("Punch Success")
                addressInfo.score = addressInfo.score+data.data
                addressInfo.todayPunch = 1
                setAddressInfo(addressInfo)
                setSendGetScore(data.data)
                my_modal_2.showModal()
            }
        } else if (item === 2) {
            const isProd = nextConfig.publicRuntimeConfig.env.API === 'prod'
            if (isProd) {
                navigator.clipboard.writeText('https://ezswap.io/#/event/airdropOverview?inviteAddress=' + owner?.toLowerCase())
            } else {
                navigator.clipboard.writeText('https://test.ezswap.io/#/event/airdropOverview?inviteAddress=' + owner?.toLowerCase())
            }
            showSuccessAlert("Copy Success")
        }
    };
    return (
        <div className={styles.wrapNewHeader}>
            <div className={styles.headerBox}>
                <div className={styles.ezLogo}>
                    <Link href='/swap'>
                        <img src='/logo.svg'/>
                    </Link>
                </div>
                <div>
                    <div className={styles.headerLeft}>
                        {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Search</a>*/}
                        <Link className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='/swap'>Swap</Link>
                        <Link className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='/collection'>Collection</Link>
                        <a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='https://forms.gle/U4wStoSQeszn16u46'target="_blank">Launchpad</a>
                        {addressInfo.dcUserId === undefined || addressInfo.dcUserId === null || addressInfo.dcUserId === '' || addressInfo.sendTwitter !== 1 ?
                            <a className={styles.launchpad + " " + styles.airdropBtn} href='https://ezswap.io/#/event/airdropOverview' target="_self">Airdrop</a>:
                            <div className={"dropdown dropdown-hover" + " "+ styles.launchpad + " " + styles.airdropColorBtn+" "+styles.rainbowBar}>
                                <div tabIndex="0" role="button" className={styles.airdropColorBtn+" "+styles.headerScore}>{addressInfo.score} PTS <span>{userHavePoineerCount>0?'1.25x':''}</span></div>
                                <ul tabIndex="0" className={"dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"+ +styles.dropStyle}>
                                    <div className={addressInfo.todayPunch === 1 ? styles.cantPunch:''}>
                                    <li className={addressInfo.todayPunch === 1 ? styles.cantPunch:''} onClick={() => handleClick(1)}><a>Get Today’s Free PTS</a></li>
                                    </div>
                                    <li onClick={() => handleClick(2)}><a>Copy Invite Link</a></li>
                                </ul>
                            </div>
                        }
                        {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='https://ezswap.readme.io/reference/overview'target="_blank">API</a>*/}
                        {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Buy/Sell Crypto</a>*/}
                    </div>
                </div>
                <div className={styles.headerRight}>
                    {/*<div className={styles.headerBtn + " " + styles.rightBtn}>My NFT</div>*/}
                    <Link className={styles.headerBtn + " " + styles.rightBtn} href='/mypool'>My Pool</Link>
                    <ConnectButton/>
                </div>
                {showAlert && <div className={styles.alertPosition}>
                    <div className={'alert'+" "+ alertText.className+ " "+styles.alertPadding}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{alertText.text}</span>
                    </div>
                </div>}
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <p className="py-4 text-2xl">Congrats! You get:<span className={styles.getScore }> {sendGetScore} Pts</span></p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    )
}

export default NavBar
