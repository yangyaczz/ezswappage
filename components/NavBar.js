import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="navbar p-4">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl">EZSWAP</a>
            </div>
            <div className="navbar-center hidden lg:flex">
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
                <ConnectButton></ConnectButton>
            </div>
        </div >

    )
}

export default NavBar