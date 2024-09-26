import React, {useState, useEffect} from "react";

import networkConfig from "../data/networkconfig.json";
import {
    useNetwork,
    useContractWrite,
    useWaitForTransaction,
    useAccount, useContractRead,
} from "wagmi";
import {useFormik} from "formik";

import {
    BuyPoolLiner,
    TradePoolLiner,
    BuyPoolExp,
    TradePoolExp,
} from "../../components/utils/calculate";
import {useRouter} from "next/router";
import {useLanguage} from "@/contexts/LanguageContext";
import ERC1155ABI from "../data/ABI/ERC1155.json";

const MyNft = () => {
    const {languageModel} = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data721List, setData721List] = useState([]);
    const [data1155List, setData1155List] = useState([]);
    const [numCount, setNumCount] = useState(0);
    const router = useRouter()

    const {chain} = useNetwork();
    const {address: owner} = useAccount();

    // useEffect(() => {
    //   setIsMounted(true);
    //   if (chain) {
    //     if (chain.id in networkConfig) {
    //       formik.setFieldValue("golbalParams", networkConfig[chain.id]);
    //     }
    //   }
    // }, [chain]);
    const {data: tokenAmount1155, refetch: balanceOfRefetch} = useContractRead({
        address: '0x31753b319f03a7ca0264A1469dA0149982ed7564',
        abi: ERC1155ABI,
        functionName: 'balanceOf',
        args: [owner, 0],
        watch: false,
        enabled: false
    })

    useEffect(() => {
        const fetchData = async () => {
            // setIsLoading(true);
            console.log('chain', chain)
            if (chain.id === 17777 || chain.id === 15557) {
                // eos & eos test
                const num = await balanceOfRefetch()
                const nftCount = parseInt(num.data, 16)
                setNumCount(nftCount)
            } else if (chain.id === 169 || chain.id === 3441005) {
                // mantatest & manta
                let parseStr = (owner).toLowerCase();
                const params = {
                    query: `
                   {
                erc1155Balances(where: { account: "${parseStr}" }) {
                  contract{
                    id
                  }
                  token {
                    id
                    identifier
                  }
                  valueExact
                }
              }`,
                    urlKey: chain.id === 169 ? 'manta' : 'mantatest',
                };
                const response = await fetch("/api/queryMantaNFT", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });
                const data1155 = await response.json();
                console.log('response1155', data1155?.data?.erc1155Balances)
                for (const erc1155data of data1155?.data?.erc1155Balances) {
                    const collectionList = networkConfig[chain.id].recommendNFT
                    for (const collection of collectionList) {
                        if (collection.address.toLowerCase() === erc1155data.contract.id.toLowerCase()) {
                            erc1155data.contract.name = collection.name
                            erc1155data.img = collection.img
                            break
                        }
                    }
                }
                setData1155List(data1155.data.erc1155Balances)
                // 721
                const params721 = {
                    query: `
                    {
                        erc721Tokens(where: { owner: "${owner.toLowerCase()}" }) {
                        contract{
                          id
                          name
                        }
                          identifier
                        }
                    }
                    `,
                    urlKey: chain.id === 169 ? 'manta' : 'mantatest',
                };
                console.log('paramsparamsparams', params721)
                const response721 = await fetch("/api/queryMantaNFT", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params721),
                });
                const data = await response721.json();
                for (const erc721Token of data.data.erc721Tokens) {
                    const collectionList = networkConfig[chain.id].recommendNFT
                    for (const collection of collectionList) {
                        if (collection.address.toLowerCase() === erc721Token.contract.id.toLowerCase()) {
                            erc721Token.img = collection.img
                            break
                        }
                    }
                }
                setData721List(data.data.erc721Tokens)
            } else if (chain.id === 1 || chain.id === 42161) {
                // arb和eth
                let frontText = "";
                if (chain.id === 1) {
                    frontText = "eth-mainnet";
                } else if (chain.id === 42161) {
                    frontText = "arb-mainnet";
                }

                const params = {
                    url: `https://${frontText}.g.alchemy.com/nft/v3/dFyzJjfLmVHlfhHyKkiSEP86fHcuFOJj/getNFTsForOwner`,
                    owner: owner,
                    withMetadata: true,
                    pageSize: 100,
                };

                const response = await fetch("/api/queryNFTByOwner", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });

                let data = await response.json();
                console.log('data:', data.ownedNfts)
                let item721List = []
                let item1155List = []
                for (const item of data.ownedNfts) {
                    let contract = {
                        id: item.contract.address,
                        name: item.collection.name
                    }
                    let token = {
                        identifier: item.tokenId
                    }
                    let resultItem = {
                        contract: contract,
                        token: token,
                        img: item.image.cachedUrl,
                        valueExact: item.balance,
                        identifier: item.tokenId
                    }
                    if (item.tokenType === "ERC721") {
                        item721List.push(resultItem)
                    }else {
                        item1155List.push(resultItem)
                    }
                }
                console.log('item721List', item721List)
              setData721List([...item721List])
              setData1155List([...item1155List])
            }
            // if (chain.id === 17777 || chain.id === 15557) {
            //   const params = {
            //     address: owner?.toLowerCase()
            //   };
            //   const response = await fetch("/api/queryECHOUserHaveToken", {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(params),
            //   });
            //   const data = await response.json();
            //   if (data.success) {
            //     setDataList(data.data)
            //   }
            // }

        };
        fetchData();
    }, [owner]);

    // if (!isMounted) {
    //   return null; //  <Loading /> ??
    // }
    // if (isLoading && formik.values.golbalParams.networkName !== undefined) {
    //   return (
    //     <div className="flex justify-center bg-base-200">
    //         <span>{languageModel.Loading}...<span className="ml-3 loading loading-spinner loading-sm"></span></span>
    //     </div>
    //   );
    // }
    return (
        <div className="bg-black">
            <div key="1" className="flex justify-center flex-wrap mt-10">
                {chain !== undefined && chain.id !== undefined && data721List.map(function (item) {
                    return <div key={item.contract.id + item.identifier} className="card w-64 border shadow-xl mr-10 mb-7">
                        <figure><img className="w-[300px] h-[300px] object-cover" src={item.img === undefined || item.img === ''|| item.img === null ? '/placeholder.png' : item.img}/></figure>
                        <div className="card-body items-center">
                            <h2 className="card-title text-center">{item.contract.name} #{item.identifier}</h2>
                        </div>
                    </div>
                })}
                {chain !== undefined && chain.id !== undefined && data1155List.map(function (item) {
                    return <div key={item.contract.name + item.valueExact} className="card w-64 border shadow-xl mr-10 mb-7">
                        <figure><img className="w-[300px] h-[300px] object-cover" src={item.img === undefined || item.img === ''|| item.img === null ? '/placeholder.png' : item.img}/></figure>
                        <div className="card-body items-center">
                            <h2 className="card-title text-center">{item.contract.name} #{item.token.identifier} * {item.valueExact}</h2>
                        </div>
                    </div>
                })}
                {numCount > 0 &&
                <div className="card w-48 bg-base-100 shadow-xl">
                    <figure><img src="https://ezonline.s3.us-west-2.amazonaws.com/echo_img2.png"/></figure>
                    <div className="card-body">
                        <h2 className="card-title">#0 * {numCount}</h2>
                    </div>
                </div>
                }
            </div>
        </div>
    );
};

export default MyNft;
