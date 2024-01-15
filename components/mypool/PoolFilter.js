import React, {useEffect, useState} from 'react'
import { ethers } from 'ethers';

import {useSendTransaction, useContractWrite, useBalance, useContractRead, useWaitForTransaction} from 'wagmi'
import ERC1155ABI from "../../pages/data/ABI/ERC1155.json";
import ERC721EnumABI from "../../pages/data/ABI/ERC721Enum.json";
import styles from './index.module.scss'
import addressSymbol from "@/pages/data/address_symbol";
import { useLanguage } from '@/contexts/LanguageContext';


const PoolFilter = ({ formik, tempPoolList,needFixPosition }) => {
    const {languageModel} = useLanguage();
    const [poolType, setPoolType] = useState("all");
    const [sortType, setSortType] = useState("sortByBalance");
    const handleRadioChange = (event) => {
        setPoolType(event.target.value)
        console.log('event.target.value', event.target.value)
    };
    const handleSortRadioChange = (event) => {
        setSortType(event.target.value)
        console.log('event.target.value', event.target.value)
    };
    useEffect(() => {
        if (poolType !== 'all'){
            const resultList=tempPoolList.filter(function (item) {
                return item.poolTypeName === poolType;
            });
            formik.setFieldValue("filterPairs", resultList);
        } else {
            formik.setFieldValue("filterPairs", tempPoolList);
        }
    }, [poolType]);

    useEffect(() => {
        let tempSortList = formik.values.filterPairs
        if (sortType === 'sortByNFT'){
            tempSortList.sort(function (a, b) {
                return a.tokenType==='ERC1155' ? (b.nftCount1155 - a.nftCount1155): (b.nftCount - a.nftCount);
            });
            formik.setFieldValue("filterPairs", tempSortList);
        } else {
            tempSortList.sort(function (a, b) {
                return (b.tokenBalance - a.tokenBalance);
            });
            formik.setFieldValue("filterPairs", tempSortList);
        }
    }, [sortType]);

    return (
        <div className={"width-7/12 border-solid border border-white rounded-lg p-2 "+ (needFixPosition && "fixed left-10 top-60") }>
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value="all" onChange={handleRadioChange} checked={poolType === "all"}/>
                    <span className="label-text text-white ml-3">{languageModel.allPool}</span>
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value="buy" onChange={handleRadioChange} checked={poolType === "buy"}/>
                    <span className="label-text text-white ml-3">{languageModel.buyPool}</span>
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value="sell" onChange={handleRadioChange} checked={poolType === "sell"}/>
                    <span className="label-text text-white ml-3">{languageModel.sellPool}</span>
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value="trade" onChange={handleRadioChange} checked={poolType === "trade"}/>
                    <span className="label-text text-white ml-3">{languageModel.tradePool}</span>
                </label>
            </div>
            <hr/>
            {/*  排序*/}
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="sortRadio" className="radio checked:bg-red-500" value="sortByNFT" onChange={handleSortRadioChange} checked={sortType === "sortByNFT"}/>
                    <span className="label-text text-white ml-3">{languageModel.sortByNFT}</span>
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer justify-start">
                    <input type="radio" name="sortRadio" className="radio checked:bg-red-500" value="sortByBalance" onChange={handleSortRadioChange} checked={sortType === "sortByBalance"}/>
                    <span className="label-text text-white ml-3">{languageModel.sortByBalance}</span>
                </label>
            </div>
        </div>
    )
}

export default PoolFilter
