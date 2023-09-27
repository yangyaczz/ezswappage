import React, { useState } from 'react'

const NFTSearch = () => {

    const [buttonText, setButtonText] = useState("Select your nft");

    const handleNFTClick = (text) => {
        setButtonText(text);
        document.getElementById('my_modal_1').close();
    }


    return (
        <div className="form-control">
            <span className="label-text">NFT</span>


            <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>
                {buttonText}
                <div>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="SwapCurrencyInputPanel__StyledDropDown-sc-442679eb-8 exTGeM"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
                </div>
            </button>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">NFT Contract Address:</h3>
                    <input type="text" placeholder="NFT Contract Address" className="input input-bordered w-full" />
                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Collaborative Project:</h3>

                    <form method="dialog" className='flex flex-col space-y-2'>
                        <button className='btn justify-start' onClick={() => handleNFTClick('nft1: zkhold111')}>nft1: zkhold111</button>
                        <button className='btn justify-start' onClick={() => handleNFTClick('nft2: zkhold222')}>nft2: zkhold222</button>
                        <button className='btn justify-start' onClick={() => handleNFTClick('nft3: zkhold333')}>nft3: zkhold333</button>
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

export default NFTSearch