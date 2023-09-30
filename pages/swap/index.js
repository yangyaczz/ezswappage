import InputAmount from '@/components/swap/InputAmount'
import NFTSearch from '@/components/swap/NFTSearch'
import Slippage from '@/components/swap/Slippage'
import TokenSearch from '@/components/swap/TokenSearch'
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNetwork, useContractRead, useAccount } from 'wagmi'


import networkConfig from '../data/networkconfig.json'
import ERC721EnumABI from '../data/ABI/ERC721Enum.json'

const Swap = () => {

  const formik = useFormik({
    initialValues: {
      chainId: '',
      collection: '',
      router: '',
      recommendNFT: '',
      pairs: '',
      canTradeToken: '',

      owner721TokenIds: '',
      owner1155TokenId: '',
      owner1155Amount: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const [isMounted, setIsMounted] = useState(false);
  const { chain } = useNetwork();
  const { address: owner } = useAccount()

  const { data: bb } = useContractRead({
    address: formik.values.collection,
    abi: ERC721EnumABI,
    functionName: 'tokensOfOwner',
    args: [owner],
    watch: false,
    onSuccess(data) {
      console.log('success', data)
      const num = data.map(item => parseInt(item._hex, 16))
      formik.setFieldValue('owner721TokenIds', num)
    }
  })

  useEffect(() => {
    setIsMounted(true);
    if (chain) {
      formik.setFieldValue('chainId', chain.id)

      if (chain.id in networkConfig) {
        formik.setFieldValue('recommendNFT', networkConfig[chain.id]["recommendNFT"])
      }
    }
  }, [chain]);





  if (!isMounted) {
    return null; //  <Loading /> ??
  }


  return (
    <div className='flex min-h-screen bg-base-200 items-center justify-center'>
      <div className="card flex-shrink-0 w-full max-w-5xl shadow-2xl bg-base-100 ">
        <div className="card-body">
          <div>
            {/* {console.log(bb)} */}
          </div>
          <div>
            {formik.values.collection}
          </div>

          <Slippage></Slippage>

          <div className='flex flex-row items-center justify-center'>
            <div className='space-y-5'>


              <NFTSearch
                recommendNFT={formik.values.recommendNFT}
                setCollection={(value) => { formik.setFieldValue('collection', value) }}
                setPairs={(value) => { formik.setFieldValue('pairs', value) }}
                setCanTradeToken={(value) => { formik.setFieldValue('canTradeToken', value) }}
              >
              </NFTSearch>


              <InputAmount formikData={formik.values}></InputAmount>
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

              <TokenSearch canTradeToken={formik.values.canTradeToken}/>


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