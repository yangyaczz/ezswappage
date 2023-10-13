import React, {useState, useEffect, useRef} from 'react';
import {BuyPoolLiner, TradePoolLiner, BuyPoolExp, TradePoolExp} from '../../utils/calculate'
import {ethers} from 'ethers';
import styles from "./index.module.scss";
import FormControl from "@mui/material/FormControl";
import {update1155SellToPairs,nftSetBanSelect} from "./Input1155Math";

function Input1155({formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded, setIsBanSelect}) {

    const [value, setValue] = useState(1);
    const tId = formikData.collection.tokenId1155
    const max = formikData.userCollection.tokenAmount1155

    const toggleSelected = (id, length) => {

        let newSids = new Array(length).fill(id)
        setSelectIds(newSids)


        ///////////////////////////////////////////////////////////////

        let pairs = JSON.parse(JSON.stringify(formikData.filterPairs))

        newSids.forEach((id) => {
            update1155SellToPairs(id, pairs)
        })

        let tupleEncode = []
        let totalGet = 0
        let IdsAmount = 0
        if (pairs.length > 0) {
            pairs.forEach((pair) => {
                if (pair.tuple) {
                    tupleEncode.push(pair.tuple)
                    totalGet += pair.userGetPrice
                    IdsAmount += pair.tokenIds.length
                }
            })
        }
        setTupleEncode(tupleEncode)
        setTotalGet(totalGet)
        ///////////////////////////////////////////////////////////////
        // check if is execeeded
        if (newSids.length > IdsAmount) {
            setIsExceeded(true)
        } else {
            setIsExceeded(false)
        }

        const result = nftSetBanSelect(newSids,formikData)
        setIsBanSelect(result)
        // check if ban
    }


    const handleChange = (e) => {
        const inputValue = e.target.value;

        // check
        if (/^\d+$/.test(inputValue)) {
            setValue(Math.min(Math.max(1, Number(inputValue)), max));
        } else {
            setValue(1);
        }
    };


    const handleIncrement = () => {
        if (!formikData.isBanSelect){
            setValue(prev => Math.min(prev + 1, max))
        }
    };

    const handleDecrement = () => {
        setValue(prev => Math.max(prev - 1, 1))
    };
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        toggleSelected(tId, value)
    }, [value]);


    //////////////////////////////////////////////////////////////////////////////
    if (formikData.userCollection.tokenAmount1155 === 0) {
        return <div>you dont have this nft</div>
    }


    return (
        <FormControl sx={{m: 1, minWidth: 400}}>
            <div className={styles.nft1155}>
                <div>Sell Amount :</div>
                <div className='form-control'>
                    <div className="input-group">
                        <button onClick={handleDecrement} className="btn btn-square">-</button>
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            className="input input-bordered w-20 text-center"
                        />
                        <button onClick={handleIncrement} className="btn btn-square">+
                        </button>
                    </div>
                </div>
            </div>
        </FormControl>
    )
}

export default Input1155;
