import React from 'react'

const OutputAmount = () => {

    const ph = 'you will receive xxx eth'
    return (
        <div className='form-control'>

            <span className="label-text">Output Amount</span>
            <input type="text" placeholder={ph} className="input input-bordered" disabled />
        </div>
    )
}

export default OutputAmount