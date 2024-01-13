import React, { useState, useEffect } from "react";

import networkConfig from "../data/networkconfig.json";
import {
  useNetwork,
  useContractWrite,
  useWaitForTransaction,
  useAccount, useContractRead,
} from "wagmi";
import { useFormik } from "formik";

import {
  BuyPoolLiner,
  TradePoolLiner,
  BuyPoolExp,
  TradePoolExp,
} from "../../components/utils/calculate";
import PoolCard from "@/components/mypool/PoolCard";
import {useRouter} from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import ERC1155ABI from "../data/ABI/ERC1155.json";

const MyNft = () => {
  const {languageModel} = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data721List, setData721List] = useState([]);
  const [data1155List, setData1155List] = useState([]);
  const [numCount, setNumCount] = useState(0);
  const router = useRouter()

  const { chain } = useNetwork();
  const { address: owner } = useAccount();

  // useEffect(() => {
  //   setIsMounted(true);
  //   if (chain) {
  //     if (chain.id in networkConfig) {
  //       formik.setFieldValue("golbalParams", networkConfig[chain.id]);
  //     }
  //   }
  // }, [chain]);
  const { data: tokenAmount1155,refetch: balanceOfRefetch } = useContractRead({
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
        const num = await balanceOfRefetch()
        const nftCount = parseInt(num.data, 16)
        setNumCount(nftCount)
      } else if (chain.id === 169 || chain.id === 3441005) {
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
    <div className="bg-base-200">
      <div key="1" className="flex justify-center flex-wrap">
        {chain !== undefined && chain.id !== undefined && (chain.id === 169 || chain.id === 3441005) && data721List.map(function (item) {
          return <div key={item.contract.id+item.identifier} className="card w-48 bg-base-100 shadow-xl mr-5 mb-5">
          <figure><img src={item.img} /></figure>
          <div className="card-body">
            <h2 className="card-title">{item.contract.name} #{item.identifier}</h2>
          </div>
        </div>
        })}
        {chain !== undefined && chain.id !== undefined && (chain.id === 169 || chain.id === 3441005) && data1155List.map(function (item) {
          return <div key={item.contract.name+item.valueExact} className="card w-48 bg-base-100 shadow-xl mr-5 mb-5">
          <figure><img src={item.img} /></figure>
          <div className="card-body">
            <h2 className="card-title">{item.contract.name} #{item.token.identifier} * {item.valueExact}</h2>
          </div>
        </div>
        })}
        {numCount>0 &&
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
