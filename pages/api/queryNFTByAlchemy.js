import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, owner, contractAddress, withMetadata, pageSize } = req.body;

    const finalUrl = `${url}?owner=${owner}&contractAddresses[]=${contractAddress}&withMetadata=${withMetadata}&pageSize=${pageSize}`;

    try {
      const apiResponse = await axios.get(finalUrl, {
        headers: {
            "Content-Type": "application/json",
        },
      });

      res.status(200).json(apiResponse.data);
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        console.error('Error Request:', error.request);
        res.status(500).json({ message: "No response received from external API" });
      } else {
        console.error('Error Message:', error.message);
        res.status(500).json({ message: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}