import React, {useState} from 'react'
import styles from "./index.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const OutputAmount = () => {

    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <FormControl sx={{ m: 1, minWidth: 400 }} className={styles.selectItem}>
            <Select
                value={age}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className={styles.selectItem}
                sx={{color:'white',background: '#06080F'}}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>ETH</em>;
                    }
                    return selected;
                }}
            >
                <MenuItem disabled value="">
                    <em>ETH</em>
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default OutputAmount
