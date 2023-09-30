import React , { useState, useEffect }from 'react'

import { useNetwork } from 'wagmi'

import dynamic from 'next/dynamic';


const SelectNetwork = dynamic(() => import('@/components/SelectNetwork'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const Create = () => {

  return (
    <div>
      <SelectNetwork />
    </div>
  )
}

export default Create