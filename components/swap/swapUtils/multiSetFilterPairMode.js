const multiSetFilterPairMode = (formikData, filteredData, owner, token, setFilterPairs, setSwapMode) => {

    // filter pool
    filteredData = filteredData.filter(item => item.owner.toLowerCase() !== owner.toLowerCase());
    if (token === 'ETH') {
        filteredData = filteredData.filter(item => item.token === null);
    } else {
        filteredData = filteredData.filter(item => item.token?.toLowerCase() === token.toLowerCase());
    }

    // rebuild pair info
    filteredData = filteredData.map(item => {
        return {
            ...item,
            tokenBalance: item.ethBalance === null ? item.tokenBalance : item.ethBalance,   // this pool token balance, vaild or not
            tokenIds: [],  // user sell tokenId in this pool
            userGetPrice: '', // user can get the price from this pool
        }
    })

    setFilterPairs(filteredData)

    if (formikData.collection.type === 'ERC721' && token === 'ETH') {
        setSwapMode('ERC721-ETH')
    } else if (formikData.collection.type === 'ERC721' && token !== 'ETH') {
        setSwapMode('ERC721-ERC20')
    } else if (formikData.collection.type === 'ERC1155' && token === 'ETH') {
        setSwapMode('ERC1155-ETH')
    } else if (formikData.collection.type === 'ERC1155' && token !== 'ETH') {
        setSwapMode('ERC1155-ERC20')
    } else {
        setSwapMode('ERROR-SWAPMODE')
    }
}

export default multiSetFilterPairMode