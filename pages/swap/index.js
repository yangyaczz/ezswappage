import InputAmount from '@/components/swap/InputAmount'
import OutputAmount from '@/components/swap/OutputAmount'
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

      // 1 得到chain和collection
      chainId: '',
      networkName: '',
      recommendNFT: '',
      router: '',

      // 2 筛选出要得到的token
      collection: '',
      pairs: '',
      canTradeToken: '',


      // 3  得到能交易的池子  自己拥有的nft

      owner721TokenIds: '',
      owner1155TokenId: '',
      owner1155Amount: '',

      //4 计算出能得到多少
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
        formik.setFieldValue('networkName', networkConfig[chain.id]["networkName"])

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

          <Slippage />

          <div className='flex flex-row items-center justify-center'>
            <div className='space-y-5'>

              <NFTSearch
                formikData={formik.values}
                setCollection={(value) => { formik.setFieldValue('collection', value) }}
                setPairs={(value) => { formik.setFieldValue('pairs', value) }}
                setCanTradeToken={(value) => { formik.setFieldValue('canTradeToken', value) }}
              />

              <InputAmount formikData={formik.values}></InputAmount>
            </div>


            <button className="btn mx-6 p-12">
              SWAP
            </button>


            <div className='space-y-5'>

              <TokenSearch formikData={formik.values} />


              <OutputAmount />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap