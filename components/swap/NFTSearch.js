
import React, { useState, useEffect } from 'react'

import { useNetwork, useContractRead, useAccount } from 'wagmi'

import ERC721EnumABI from '../../pages/data/ABI/ERC721Enum.json'
import ERC1155ABI from '../../pages/data/ABI/ERC1155.json'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import styles from './index.module.scss';


import multiSetFilterPairMode from './swapUtils/multiSetFilterPairMode'
import {nftSetBanSelect} from "./swapUtils/Input721Math";

const NFTSearch = ({ formikData, owner, reset123, setCollection, setUserCollection, setPairs, setTokens, setTokensName, setToken, setTokenName, setFilterPairs, setSwapMode,setIsBanSelect }) => {


    const [searchQuery, setSearchQuery] = useState('');
    const [age, setAge] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredNFTs = formikData.golbalParams.recommendNFT
        ? formikData.golbalParams.recommendNFT.filter(nft =>
            nft.name.toLowerCase().includes(searchQuery) || nft.address.toLowerCase().includes(searchQuery)
        )
        : [];


    const handleNFTClick = (event,nft) => {
        reset123()
        setAge(event.target.value);
        for (let i = 0; i < filteredNFTs.length; i++) {
            if (filteredNFTs[i].address+filteredNFTs[i].tokenId1155 === nft.props.value) {
                setCollection(filteredNFTs[i])
                break
            }
        }
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
                    if (formikData.collection.type === 'ERC1155') {
                        filteredData = filteredData.filter(item => item.nftId1155 === formikData.collection.tokenId1155);
                    }
                    setPairs(filteredData)

                    let canTradeToken = [...new Set(filteredData.map(item => item.token))].map(token => token === null ? 'ETH' : token);
                    let permitTokens = formikData.golbalParams.recommendERC20.map(item => item.address.toLowerCase())
                    canTradeToken = canTradeToken.filter(token => permitTokens.includes(token.toLowerCase()))

                    setTokens(canTradeToken)

                    const tokensNames = canTradeToken.map(address => {
                        const mappingObject = formikData.golbalParams.recommendERC20.find(obj => obj.address.toLowerCase() === address.toLowerCase());
                        return mappingObject ? mappingObject.name : null;
                    });

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
                        if (formikData.collection.type === 'ERC721') {
                            const result=nftSetBanSelect([],formikData)
                            setIsBanSelect(result)
                        }
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
            {/*<span className="label-text">NFT</span>*/}
            <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
                <Select
                    value={age}
                    onChange={handleNFTClick}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className={styles.selectItem}
                    sx={{color:'white',background: '#06080F'}}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <div className={styles.selectDefault}><span className={styles.selectDefaultSpan}>Select Collection</span><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg></div>;
                        }
                        for (let i = 0; i < filteredNFTs.length; i++) {
                            if (filteredNFTs[i].address+filteredNFTs[i].tokenId1155 === selected) {
                                return <div className={styles.selectedStyle}><img className={styles.logoStyle} src={filteredNFTs[i].img} alt=""/>{filteredNFTs[i].name}</div>
                            }
                        }
                        return selected;
                    }}
                >
                    <MenuItem disabled value="">
                        <div>Select Collection</div>
                    </MenuItem>
                    {filteredNFTs.map((nft, index) => (
                        <MenuItem key={nft.address+nft.tokenId1155} value={nft.address+nft.tokenId1155} className={styles.selectItem}><img className={styles.logoStyle} src={nft.img} alt=""/>{nft.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default NFTSearch
