import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios.post("https://testapi.ezswap.io/"+ 'echo/queryUserHaveToken', req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || {});
    }
}
