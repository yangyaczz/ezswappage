import { id } from 'ethers/lib/utils.js';
import React, { useState } from 'react'

const InputAmount = ({ formikData, setSelectIds }) => {



    const toggleSelected = (id) => {


        let newSids

        if (formikData.selectIds.includes(id)) {
            newSids = formikData.selectIds.filter(item => item !== id)
        } else {
            newSids = [...formikData.selectIds, id]
        }

        setSelectIds(newSids)

    }

    const displayFrame = () => {
        if (!formikData.selectIds.length) {
            return <div>
                your tokenId
            </div>
        }

        if (formikData.collection.type === "ERC721") {
            return <div className='flex '>
                tokenId: {formikData.selectIds.map((id, index) => (<div className='mr-1' key={index}>
                    {id}
                </div>))}
            </div>
        }

        // todo 1155
        if (formikData.collection.type === "ERC1155") {
            return <div>
                xxxxxxxx
            </div>
        }
    }



    const displayDialog = () => {

        if (!formikData.collection.type || !formikData.token) {
            return <div>select nft and token first</div>
        }

        if (formikData.userCollection.tokenIds721 === '') {
            return <div>Loading...</div>
        }

        if (formikData.collection.type == "ERC721") {

            const initialSquares = formikData.userCollection.tokenIds721

            if (!initialSquares.length) {
                return <div>you dont have this nft</div>
            }

            return <div className='grid grid-cols-5 gap-4'>
                {initialSquares.map((square, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-center w-20 h-20 ${(formikData.selectIds.includes(square)) ? 'bg-gray-400' : 'bg-white'} cursor-pointer`}
                        onClick={() => { toggleSelected(square) }
                        }
                    >
                        {square}
                    </div>
                ))}
            </div>
        }

        // todo 1155
        if (formikData.collection.type == "ERC1155") {

            if (formikData.userCollection.tokenAmount1155 === 0) {
                return <div>you dont have this nft</div>
            }

            const initialSquares = Array(formikData.userCollection.tokenAmount1155).fill(formikData.collection.tokenId1155)

            // todo
            return <div className='grid grid-cols-5 gap-4'>
                {initialSquares.map((square, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-center w-20 h-20 ${(formikData.selectIds.includes(square)) ? 'bg-gray-400' : 'bg-white'} cursor-pointer`}
                        onClick={() => { toggleSelected(square) }
                        }
                    >
                        {square}
                    </div>
                ))}
            </div>
        }

    }


    return (
        <div className="form-control">
            <span className="label-text">Input Amount</span>


            <button className="btn" onClick={() => document.getElementById('input_sell').showModal()}>
                {displayFrame()}
                <div>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
                </div>
            </button>

            <dialog id="input_sell" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">TokenId:</h3>


                    {displayDialog()}


                    <div className="divider"></div>

                    <h3 className="font-bold text-lg">NFT Amount:</h3>
                    {/* <input type="range" min={0} max={initialSquares.length} value={selectedCount} className="range"></input> */}


                    <div className="mt-4">
                        You have select: {formikData.selectIds.length}
                    </div>


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

export default InputAmount