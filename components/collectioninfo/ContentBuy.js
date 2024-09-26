import {useCollectionInfo} from "@/contexts/CollectionInfoContext";
import PriceChart from "./PriceChart";
import React, {useEffect, useState} from "react";
import {MaxFiveDecimal} from "../utils/roundoff";

const ContentBuy = () => {
    const {colInfo, tradeActivities, updateTradeActivities} =
        useCollectionInfo();

    const [nftList, setNftList] = useState([]);

    useEffect(() => {
        // console.log('colInfo.address', colInfo.address)
        fetchData(colInfo.address)
        // console.log('resultData', resultData)
    }, [colInfo.address]);

    async function fetchData(contractAddress) {
        let params = {
            contractAddress: contractAddress,
            network: 'ethmain'
        }
        // if (type === "ERC1155") params = { ...params, tokenId: tokenId1155 };

        const response = await fetch("/api/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        })
        const resultData = await response.json()
        console.log('resultData', resultData)
        const list = resultData.data
        console.log('list', list)
        // let nftList = []

        for (const pool of list) {
            if (pool.type === 'sell' || pool.type === 'trade') {
                if (pool.nftIds.length > 0) {
                    for (const tokenId of pool.nftIds) {
                        if (tokenId !== '') {
                            let nft = {"tokenId": tokenId, "img": "https://ezonline.s3.us-west-2.amazonaws.com/ezpoineer.png"}
                            setNftList([...nftList, nft])
                        }

                    }
                }
            }

        }
    }


    return (
        <>
            <section className="w-full h-[470px] p-4 border-[1px] border-solid border-[#496C6D] rounded-lg grid grid-rows-[40px,auto] justify-items-stretch">
                <div className="flex flex-wrap justify-center">
                    {nftList.map(nft => {
                        return (
                            <div key={nft.tokenId} className="border mr-3 flex flex-col items-center">
                                <img
                                    src={nft.img}
                                    style={{
                                        width: `100px`,
                                    }}
                                />
                                <p>{nft.tokenId}</p>
                            </div>
                        );
                    })}

                </div>
            </section>
        </>
    );
};

export default ContentBuy;
