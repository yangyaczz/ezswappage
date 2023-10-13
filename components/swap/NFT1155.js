import React, {useEffect, useState} from 'react'

import Input721 from './swapUtils/Input721';
import Input1155 from './swapUtils/Input1155';
import FormControl from "@mui/material/FormControl";
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {BuyPoolExp, BuyPoolLiner, TradePoolExp, TradePoolLiner} from "../utils/calculate";
import {ethers} from "ethers";
import {Box, Chip, OutlinedInput} from "@mui/material";
import { useTheme } from '@mui/material/styles';


const NFT1155 = ({ formikData, setSelectIds, setTupleEncode, setTotalGet, setIsExceeded,setIsBanSelect }) => {

    return (
        <div className="form-control">
            <Input1155
                formikData={formikData}
                setSelectIds={setSelectIds}
                setTotalGet={setTotalGet}
                setTupleEncode={setTupleEncode}
                setIsExceeded={setIsExceeded}
                setIsBanSelect={setIsBanSelect}
            />

        </div>
    )
}

export default NFT1155
