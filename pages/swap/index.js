import InputAmount from '@/components/swap/InputAmount'
import NFT1155 from '@/components/swap/NFT1155'
import OutputAmount from '@/components/swap/OutputAmount'
import NFTSearch from '@/components/swap/NFTSearch'
import Slippage from '@/components/swap/Slippage'
import SwapButton from '@/components/swap/SwapButton'
import TokenSearch from '@/components/swap/TokenSearch'
import styles from './index.module.scss'
import { ethers } from 'ethers'

import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNetwork, useAccount } from 'wagmi'

import networkConfig from '../data/networkconfig.json'
import {useSelector} from "react-redux";

const Swap = () => {

  const formik = useFormik({
    initialValues: {

      // 0   全局变量设置
      golbalParams: '',

      // 1   nft search 要设置成功的 collection , 所有的pairs 和 能交易所的 tokens, 用户拥有的这个nft情况
      collection: {
        type: "",
        address: "",
        name: "",
        tokenId1155: "",
        img:""
      },
      userCollection: {
        tokenIds721: '',
        tokenAmount1155: ''
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
        tokenAmount1155: ''
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



  if (!isMounted) {
    return null; //  <Loading /> ??
  }

  return (
      <div className={styles.divBackground}>
    <div className='flex min-h-screen items-center justify-center'>
      <div className="card flex-shrink-0 w-full max-w-5xl shadow-2xl bg-base-100 ">
        <div className="card-body">
          {/*<Slippage />*/}
          <div className='flex flex-row items-center justify-center'>
            <div className='space-y-2'>
              <div className="font-bold text-sm">NFT</div>
                <div className={styles.containDiv}>
                  <NFTSearch
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
                    setIsBanSelect={(value) => { formik.setFieldValue('isBanSelect', value) }}
                  />

                  {formik.values.collection.type === '' || formik.values.collection.type === "ERC721"?<InputAmount
                      formikData={formik.values}
                      setSelectIds={(value) => { formik.setFieldValue('selectIds', value) }}
                      setTotalGet={(value) => { formik.setFieldValue('totalGet', value) }}
                      setTupleEncode={(value) => { formik.setFieldValue('tupleEncode', value) }}
                      setIsExceeded={(value) => { formik.setFieldValue('isExceeded', value) }}
                      setIsBanSelect={(value) => { formik.setFieldValue('isBanSelect', value) }}
                    />:<NFT1155
                      formikData={formik.values}
                      setSelectIds={(value) => { formik.setFieldValue('selectIds', value) }}
                      setTotalGet={(value) => { formik.setFieldValue('totalGet', value) }}
                      setTupleEncode={(value) => { formik.setFieldValue('tupleEncode', value) }}
                      setIsExceeded={(value) => { formik.setFieldValue('isExceeded', value) }}
                      setIsBanSelect={(value) => { formik.setFieldValue('isBanSelect', value) }}
                  />}
                  <div className={styles.exchangeIcon}>
                    <img src="/exchange.svg" alt=""/>
                  </div>
                  <div className='space-y-2'>
                    <div className="font-bold text-sm">Token</div>
                    <TokenSearch
                        formikData={formik.values}
                        owner={owner}
                        reset23={reset23}
                        setToken={(value) => { formik.setFieldValue('token', value) }}
                        setTokenName={(value) => { formik.setFieldValue('tokenName', value) }}
                        setFilterPairs={(value) => { formik.setFieldValue('filterPairs', value) }}
                        setSwapMode={(value) => { formik.setFieldValue('swapMode', value) }}
                        setIsBanSelect={(value) => { formik.setFieldValue('isBanSelect', value) }}
                    />
                  </div>
                  <div className={styles.swapButton}>
                  <SwapButton formikData={formik.values} owner={owner} reset23={reset23}/>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  )
}

export default Swap
