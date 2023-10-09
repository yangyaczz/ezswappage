    // const { erc20Approval, setErc20Approval } = useState(false)
    
    // const { data: erc20AllowanceData } = useContractRead({
    //     address: (formikData.token && formikData.token !== "ETH" ? formikData.token : null),
    //     abi: erc20ABI,
    //     functionName: 'allowance',
    //     args: [owner, formikData.golbalParams.router],
    //     watch: true,
    //     onSuccess(data) {
    //         if (!data.gte(formikData.totalCost)) {
    //             console.log('not enought')
    //         } else {
    //             console.log('ok')
    //             setErc20Approval(true)
    //         }
    //     }
    // })



    // const { data: bb } = useContractReads(
    //     {
    //         contracts: [
    //             // nft approval
    //             // {
    //             //     address: formikData.collection.address,
    //             //     abi: ERC721EnumABI,
    //             //     functionName: 'isApprovedForAll',
    //             //     args: [owner, formikData.golbalParams.router],
    //             //     watch: false,
    //             // },
    //             // erc20 approval
    //             {
    //                 address: (formikData.token && formikData.token !== "ETH" ? formikData.token : null),
    //                 abi: erc20ABI,
    //                 functionName: 'allowance',
    //                 args: [owner, formikData.golbalParams.router],
    //                 watch: false,
    //             }
    //         ],
    //         onSuccess(data) {
    //             // console.log('success', data)
    //             // const num = data.map(item => parseInt(item._hex, 16))
    //             // // filter 1155 and 721
    //             // setUserCollection({
    //             //     tokenIds721: num
    //             // })
    //         }
    //     }
    // )