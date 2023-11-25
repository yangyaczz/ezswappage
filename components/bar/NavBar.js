import React from 'react'
import {ConnectButton} from '@rainbow-me/rainbowkit'
import styles from './index.module.scss'
import Link from "next/link";

const NavBar = () => {
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
                        {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad} href='https://ezswap.readme.io/reference/overview'target="_blank">API</a>*/}
                        {/*<a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Buy/Sell Crypto</a>*/}
                    </div>
                </div>
                <div className={styles.headerRight}>
                    {/*<div className={styles.headerBtn + " " + styles.rightBtn}>My NFT</div>*/}
                    {/*<div className={styles.headerBtn + " " + styles.rightBtn}>My Pool</div>*/}
                    <ConnectButton/>
                </div>
            </div>
        </div>
    )
}

export default NavBar
