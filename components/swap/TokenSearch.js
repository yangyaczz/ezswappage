import React, { useState } from 'react'

const TokenSearch = ({canTradeToken}) => {
    const [buttonText, setButtonText] = useState("Select you want token");

    const handleTokenClick = (token) => {
        setButtonText(token);
        // setCollection(address)
        document.getElementById('token_search_sell').close();
    }



    return (
        <div className="form-control">
            <span className="label-text">Token</span>


            <button className="btn" onClick={() => document.getElementById('token_search_sell').showModal()}>
                {buttonText}
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
            </button>

            <dialog id="token_search_sell" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Can Trade Token:</h3>


                    <form method="dialog" className='flex flex-col space-y-2'>
                        { (canTradeToken) ? canTradeToken.map((token, index) => (
                            <button
                                key={index}
                                className="btn justify-start"
                                onClick={() => handleTokenClick(token)}>
                                {token}
                            </button>
                        )) : <div>select your nft first</div>}
                    </form>


                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                </div>


                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>


            </dialog>


        </div>
    )
}

export default TokenSearch