import axios from 'axios';

const urlMappings = {
    'mantatest': 'https://api.goldsky.com/api/public/project_clnv4qr7e30dv33vpgx7y0f1d/subgraphs/fer-testnet/manta-pacific-testnet-nfts/gn',
    'manta': 'https://api.goldsky.com/api/public/project_clnv4qr7e30dv33vpgx7y0f1d/subgraphs/fer/manta-pacific-mainnet-nfts/gn'
  };

export default async function handler(req, res) {
    const urlKey = req.body.urlKey;
    const apiUrl = urlMappings[urlKey];

    if (!apiUrl) {
        return res.status(400).json({ error: 'Invalid URL key provided.' });
    }
    try {
        const response = await axios.post(apiUrl, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || {});
    }
}
