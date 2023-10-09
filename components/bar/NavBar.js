import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="navbar p-4">
            <div className="navbar-start">
                <img src='/logo.svg' />
            </div>
            <div className="navbar-center">
                <a class="header-btn search-btn launchpad">Search</a>
                <a class="header-btn search-btn launchpad">Launchpad</a>
                <a class="header-btn search-btn launchpad">API</a>
                <a class="header-btn search-btn launchpad">Buy/Sell Crypto</a>
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <details>
                            <summary>Function</summary>
                            <ul className="p-2 ">
                                <li>
                                    <Link href='/swap'>
                                        SWAP
                                    </Link></li>
                                <li>
                                    <Link href='/create'>
                                        CREATE
                                    </Link>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <ConnectButton />
            </div>
        </div >

    )
}

export default NavBar
