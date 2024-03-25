import axios from 'axios';
import {LAUNCHPAD_BASE_URL} from "../../config/constant";

export default async function handler(req, res) {
    try {
        const response = await axios.post(LAUNCHPAD_BASE_URL+ 'launchpad/queryDetail', req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || {});
    }
}
