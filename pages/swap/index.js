import InputAmount from '@/components/swap/InputAmount'
import NFTSearch from '@/components/swap/NFTSearch'
import SwapButton from '@/components/swap/SwapButton'
import TokenSearch from '@/components/swap/TokenSearch'

import { ethers } from 'ethers'

import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNetwork, useAccount } from 'wagmi'

import networkConfig from '../data/networkconfig.json'


const Swap = () => {

  const [swapType, setSwapType] = useState('buy');

  const formik = useFormik({
    initialValues: {

      // 0   全局变量设置
      golbalParams: '',

      // 1   nft search 要设置成功的 collection , 所有的pairs 和 能交易所的 tokens, 用户拥有的这个nft情况
      collection: {
        type: "",
        address: "",
        name: "",
        tokenId1155: ""
      },
      userCollection: {
        tokenIds721: '',
        tokenAmount1155: '',
        tokenBalance20: ''
      },
      pairs: '',
      tokens: '',
      tokensName: '',


      // 2 用户点击tokensearch，从canTradeToken中选要换的token  得到能交易的池子 
      token: '',
      tokenName: '',
      filterPairs: '',
      swapMode: '',


      //  3
      selectIds: '',
      totalGet: '',
      tupleEncode: '',
      isExceeded: '',
      isBanSelect: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const [isMounted, setIsMounted] = useState(false);

  // 0 
  const { chain } = useNetwork();
  const { address: owner } = useAccount()


  // 0 => 1 , reset 2 3
  useEffect(() => {
    setIsMounted(true);
    reset123()
    if (chain) {
      if (chain.id in networkConfig) {
        formik.resetForm()
        formik.setFieldValue('golbalParams', networkConfig[chain.id])
      }
    }
  }, [chain, owner]);




  const reset123 = () => {
    reset1()
    reset2()
    reset3()
  }

  const reset23 = () => {
    reset2()
    reset3()
  }

  const reset1 = () => {
    formik.setFieldValue('collection',
      {
        type: "",
        address: "",
        name: "",
        tokenId1155: ""
      })
    formik.setFieldValue('userCollection',
      {
        tokenIds721: '',
        tokenAmount1155: '',
        tokenBalance20: ''
      })
    formik.setFieldValue('pairs', '')
    formik.setFieldValue('tokens', '')
    formik.setFieldValue('tokensName', '')
  }


  const reset2 = () => {
    formik.setFieldValue('token', '')
    formik.setFieldValue('tokenName', '')
    formik.setFieldValue('filterPairs', '')
    formik.setFieldValue('swapMode', '')
  }


  const reset3 = () => {
    formik.setFieldValue('selectIds', '')
    formik.setFieldValue('totalGet', '')
    formik.setFieldValue('tupleEncode', '')
    formik.setFieldValue('isExceeded', '')
    formik.setFieldValue('isBanSelect', '')
  }

  const handleInputSwapTypeChange = (event) => {
    setSwapType(event.target.value);
    reset123()
  };


  if (!isMounted) {
    return null; //  <Loading /> ??
  }
  return (
    <div className='flex flex-col min-h-screen bg-base-200 items-center justify-center'>
      {/* <div className="alert alert-success top-4 right-4 w-1/3">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Your purchase has been confirmed!</span>
      </div> */}

      <div className="join border-y-2 mb-10">
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="buy"
          aria-label="BUY"
          checked={swapType === 'buy'}
          onChange={handleInputSwapTypeChange}
        />
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="sell"
          aria-label="SELL"
          checked={swapType === 'sell'}
          onChange={handleInputSwapTypeChange}
        />
      </div>

      <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100 items-center">
        <div className="card-body w-2/3 space-y-6">

          <div className='space-y-2'>
            <span className="font-bold text-sm">Collection</span>
            <NFTSearch
              swapType={swapType}
              formikData={formik.values}
              owner={owner}
              reset123={reset123}
              setCollection={(value) => { formik.setFieldValue('collection', value) }}
              setUserCollection={(value) => { formik.setFieldValue('userCollection', value) }}
              setPairs={(value) => { formik.setFieldValue('pairs', value) }}
              setTokens={(value) => { formik.setFieldValue('tokens', value) }}
              setTokensName={(value) => { formik.setFieldValue('tokensName', value) }}

              setToken={(value) => { formik.setFieldValue('token', value) }}
              setTokenName={(value) => { formik.setFieldValue('tokenName', value) }}
              setFilterPairs={(value) => { formik.setFieldValue('filterPairs', value) }}
              setSwapMode={(value) => { formik.setFieldValue('swapMode', value) }}
            />

            <InputAmount
              swapType={swapType}
              formikData={formik.values}
              setSelectIds={(value) => { formik.setFieldValue('selectIds', value) }}
              setTotalGet={(value) => { formik.setFieldValue('totalGet', value) }}
              setTupleEncode={(value) => { formik.setFieldValue('tupleEncode', value) }}
              setIsExceeded={(value) => { formik.setFieldValue('isExceeded', value) }}
              setIsBanSelect={(value) => { formik.setFieldValue('isBanSelect', value) }}
            />
          </div>

          <div className='flex justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </div>


          <div className='space-y-2'>
            <div className="font-bold text-sm">Token</div>
            <TokenSearch
              swapType={swapType}
              formikData={formik.values}
              owner={owner}
              reset23={reset23}
              setToken={(value) => { formik.setFieldValue('token', value) }}
              setTokenName={(value) => { formik.setFieldValue('tokenName', value) }}
              setFilterPairs={(value) => { formik.setFieldValue('filterPairs', value) }}
              setSwapMode={(value) => { formik.setFieldValue('swapMode', value) }}
            />
          </div>

          <SwapButton
            swapType={swapType}
            formikData={formik.values}
            owner={owner}
          />

        </div>
      </div>

    </div>
  )
}

export default Swap