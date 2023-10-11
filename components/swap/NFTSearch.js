
import React, { useState, useEffect } from 'react'

import { useNetwork, useContractRead, useAccount } from 'wagmi'

import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'

import multiSetFilterPairMode from './swapUtils/multiSetFilterPairMode'

const NFTSearch = ({ formikData, owner, reset123, setCollection, setUserCollection, setPairs, setTokens, setTokensName, setToken, setTokenName, setFilterPairs, setSwapMode }) => {


    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredNFTs = formikData.golbalParams.recommendNFT
        ? formikData.golbalParams.recommendNFT.filter(nft =>
            nft.name.toLowerCase().includes(searchQuery) || nft.address.toLowerCase().includes(searchQuery)
        )
        : [];


    const handleNFTClick = (nft) => {
        reset123()
        setCollection(nft)
    }

    useEffect(() => {

        const fetchData = async () => {
            if (formikData.golbalParams.networkName && formikData.collection.address) {
                const params = {
                    contractAddress: formikData.collection.address,
                    network: formikData.golbalParams.networkName,
                };

                const response = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });

                const data = await response.json();

                if (data.success) {
                    const pairsList = data.data
                    let filteredData = pairsList.filter(item => item.type === 'buy' || item.type === 'trade');
                    setPairs(filteredData)

                    let canTradeToken = [...new Set(filteredData.map(item => item.token))].map(token => token === null ? 'ETH' : token);
                    let permitTokens = formikData.golbalParams.recommendERC20.map(item => item.address.toLowerCase())
                    canTradeToken = canTradeToken.filter(token => permitTokens.includes(token.toLowerCase()))

                    setTokens(canTradeToken)

                    const tokensNames = canTradeToken.map(address => {
                        const mappingObject = formikData.golbalParams.recommendERC20.find(obj => obj.address.toLowerCase() === address.toLowerCase());
                        return mappingObject ? mappingObject.name : null;
                    });

                    console.log(tokensNames)

                    setTokensName(tokensNames)


                    if (canTradeToken.length) {
                        let token
                        if (canTradeToken.includes('ETH')) {
                            token = 'ETH'
                        } else {
                            token = canTradeToken[0]
                        }
                        setToken(token)
                        setTokenName(tokensNames[0])

                        multiSetFilterPairMode(formikData, filteredData, owner, token, setFilterPairs, setSwapMode)
                    }
                }
            }
        }
        fetchData()



    }, [formikData.golbalParams.networkName, formikData.collection.address])


    const { data: tokenIds721 } = useContractRead({
        address: (formikData.collection.type === "ERC721" ? formikData.collection.address : ''),
        abi: ERC721EnumABI,
        functionName: 'tokensOfOwner',
        args: [owner],
        watch: false,
        onSuccess(data) {
            const num = data.map(item => parseInt(item._hex, 16))
            setUserCollection({
                tokenIds721: num
            })
        }
    })

    const { data: tokenAmount1155 } = useContractRead({
        address: (formikData.collection.type === "ERC1155" ? formikData.collection.address : ''),
        abi: ERC1155ABI,
        functionName: 'balanceOf',
        args: [owner, formikData.collection.tokenId1155],
        watch: false,
        onSuccess(data) {
            const num = parseInt(data, 16)
            setUserCollection({
                tokenAmount1155: num
            })
        }
    })



    return (
        <div className="form-control">
            <span className="label-text">NFT</span>

            <button className="btn" onClick={() => document.getElementById('nft_search_sell').showModal()}>
                {(formikData.collection.name) ? formikData.collection.name : "NFT name"}
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
            </button>

            <dialog id="nft_search_sell" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">NFT Contract Address:</h3>
                    <div className='input-group'>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="NFT Contract Address"
                            className="input input-bordered w-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="divider"></div>
                    <h3 className="font-bold text-lg">Collaborative Project:</h3>

                    <form method="dialog" className='flex flex-col space-y-2'>
                        {filteredNFTs.map((nft, index) => (
                            <button
                                key={index}
                                className="btn"
                                onClick={() => handleNFTClick(nft)}>
                                {nft.name}: {nft.address}
                            </button>
                        ))}
                    </form>


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

export default NFTSearch