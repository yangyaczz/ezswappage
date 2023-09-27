import React, { useState } from 'react'

const InputAmount = () => {
    const [buttonText, setButtonText] = useState("Select your tokenId");

    const n = 10;
    const initialSquares = Array.from({ length: n }).map((_, index) => `zkh-${index + 1}`);
    const [selectedSquares, setSelectedSquares] = useState({});
    const [selectedCount, setSelectedCount] = useState(0);

    const toggleSelected = (id) => {
        setSelectedSquares(prevState => {
            const updatedState = {
                ...prevState,
                [id]: !prevState[id]
            };

            const count = Object.values(updatedState).filter(Boolean).length;
            setSelectedCount(count);

            return updatedState;
        });
    }

    const handleNFTClick = (text) => {
        setButtonText(text);
        document.getElementById('my_modal_2').close();
    }


    return (
        <div className="form-control">
            <span className="label-text">Amount</span>


            <button className="btn" onClick={() => document.getElementById('my_modal_2').showModal()}>
                {buttonText}
                <div>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="SwapCurrencyInputPanel__StyledDropDown-sc-442679eb-8 exTGeM"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
                </div>
            </button>

            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">TokenId:</h3>
                    <div className='grid grid-cols-5 gap-4'>
                        {initialSquares.map((square, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-center w-20 h-20 ${selectedSquares[square] ? 'bg-gray-400' : 'bg-white'} border border-gray-300 cursor-pointer`}
                                onClick={() => toggleSelected(square)}
                            >
                                {square}
                            </div>
                        ))}
                    </div>

                    <div className="divider"></div>

                    <h3 className="font-bold text-lg">NFT Amount:</h3>
                    <input type="range" min={0} max={n} value={selectedCount} className="range" />
                    <div className="mt-4">
                        You have select: {selectedCount}
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