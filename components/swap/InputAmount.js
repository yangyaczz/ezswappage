import React from 'react'

import Input721Sell from './swapUtils/Input721Sell';
import Input1155Sell from './swapUtils/Input1155Sell';

import Input721Buy from './swapUtils/Input721Buy';


const InputAmount = ({ swapType, formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded, setIsBanSelect }) => {

    const displayFrame = () => {
        if (!formikData.selectIds.length) {
            return <div>
                select item
            </div>
        }

        return <div>
            amount
        </div>
    }


    const displaySellDialog = () => {

        // console.log('displaySellDialog', formikData.collection.filterPairs)

        if (!formikData.collection.type || !formikData.token) {
            return <div>Select collection and token first...</div>
        }

        if (formikData.userCollection.tokenIds721 === '') {
            return <div>Loading...</div>
        }

        if (formikData.pairs && formikData.filterPairs.length === 0) {
            return <div>No liquidity for swap...</div>
        }

        if (formikData.collection.type == "ERC721") {
            return (
                <Input721Sell
                    formikData={formikData}
                    setSelectIds={setSelectIds}
                    setTotalGet={setTotalGet}
                    setTupleEncode={setTupleEncode}
                    setIsExceeded={setIsExceeded}
                    setIsBanSelect={setIsBanSelect}
                />
            )
        }

        if (formikData.collection.type == "ERC1155") {
            return (
                <Input1155Sell
                    formikData={formikData}
                    setSelectIds={setSelectIds}
                    setTotalGet={setTotalGet}
                    setTupleEncode={setTupleEncode}
                    setIsExceeded={setIsExceeded}
                />
            )
        }
    }

    const displayBuyDialog = () => {

        // console.log('displaySellDialog', formikData.collection.filterPairs)

        if (!formikData.collection.type || !formikData.token) {
            return <div>Select collection and token first...</div>
        }

        if (formikData.userCollection.tokenBalance20 === '') {
            return <div>Loading.....</div>
        }

        if (formikData.pairs && formikData.filterPairs.length === 0) {
            return <div>No liquidity for swap...</div>
        }

        if (formikData.collection.type == "ERC721") {
            return (
                <Input721Buy
                    formikData={formikData}
                    setSelectIds={setSelectIds}
                    setTotalGet={setTotalGet}
                    setTupleEncode={setTupleEncode}
                    setIsExceeded={setIsExceeded}
                    setIsBanSelect={setIsBanSelect}
                />
            )
        }

        // if (formikData.collection.type == "ERC1155") {
        //     return (
        //         <Input1155
        //             formikData={formikData}
        //             setSelectIds={setSelectIds}
        //             setTotalGet={setTotalGet}
        //             setTupleEncode={setTupleEncode}
        //             setIsExceeded={setIsExceeded}
        //         />
        //     )
        // }
    }


    return (
        <div className="form-control">
            <button className="btn justify-between" onClick={() => document.getElementById('input_sell').showModal()}>
                <div className='flex justify-start items-center space-x-2'>
                    {displayFrame()}
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
                </div>
                <div className='justify-end'>{formikData.selectIds.length}</div>
            </button>

            <dialog id="input_sell" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Item:</h3>

                    {(swapType === 'buy') ? displayBuyDialog() : displaySellDialog()}

                    <div>{formikData.isExceeded && 'The amount of nft is out of range, please reduce it'}</div>
                    <div className="divider"></div>

                    <h3 className="font-bold text-lg">Amount:</h3>

                    <div className="mt-4">
                        You have select {formikData.selectIds.length} and you will get {formikData.totalGet}
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