import React, { useEffect } from 'react'
import { useNetwork } from 'wagmi';
import networkConfig from '../pages/data/networkconfig.json';

const SelectNetwork = ({ setChainId }) => {
    const { chain, chains } = useNetwork();


    // useEffect(()=> {
    //     if(chain) {
    //         setChainId('chainId', chain.id)
    //     }
    // }, [chain])

    return (
        <>
            <div>
                { chain && [chain.id, '------', chain.name, '----------', (chain.id).toString(16)]}
            </div>
        </>
    );
}

export default SelectNetwork