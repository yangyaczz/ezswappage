import InputAmount from '@/components/swap/InputAmount'
import NFTSearch from '@/components/swap/NFTSearch'
import Slippage from '@/components/swap/Slippage'
import React from 'react'

const Swap = () => {
  return (
    <div className='flex min-h-screen bg-base-200 items-center justify-center'>
      <div className="card flex-shrink-0 w-full max-w-5xl shadow-2xl bg-base-100 ">
        <div className="card-body">

          <Slippage></Slippage>

          <div className='flex flex-row items-center justify-center'>
            <div className='space-y-5'>



              <NFTSearch></NFTSearch>


              <InputAmount></InputAmount>
            </div>

            <div>
              <label className="label">
                <span className="label-text"></span>
                <span className="label-text pr-6">

                </span>
              </label>
              <button className="btn mx-6 p-12">
                SWAP
              </button>
            </div>

            <div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Token</span>
                </label>
                <select className="select select-bordered">
                  <option selected>ETH</option>
                  <option>USDT</option>
                  <option>USDC</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Output Amount</span>
                </label>
                <input type="text" placeholder="output amount" className="input input-bordered" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap