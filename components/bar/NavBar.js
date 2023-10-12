import React from 'react'
import {ConnectButton} from '@rainbow-me/rainbowkit'
import styles from './index.module.scss'

const NavBar = () => {
    return (
        <div className={styles.wrapNewHeader}>
            <div className={styles.headerBox}>
                <div className={styles.ezLogo}>
                    <img src='/logo.svg'/>
                </div>
                <div>
                    <div className={styles.headerLeft}>
                        <a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Search</a>
                        <a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Launchpad</a>
                        <a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>API</a>
                        <a className={styles.headerBtn + " " + styles.headerBtn + " " + styles.launchpad}>Buy/Sell Crypto</a>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div class={styles.headerBtn + " " + styles.rightBtn}>My NFT</div>
                    <div class={styles.headerBtn + " " + styles.rightBtn}>My Pool</div>
                    <ConnectButton/>
                </div>
            </div>
        </div>
    )
}

export default NavBar