import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const FIXEDFLOAT_CONFIG = {
  apiKey: process.env.FIXEDFLOAT_API_KEY,
  apiSecret: process.env.FIXEDFLOAT_API_SECRET,
  baseURL: 'https://api.fixedfloat.com/v1'
};

function generateSignature(endpoint, data) {
  const message = endpoint + data;
  return crypto
    .createHmac('sha256', FIXEDFLOAT_CONFIG.apiSecret)
    .update(message)
    .digest('hex');
}

async function makeFixedFloatRequest(method, endpoint, data = '') {
  const signature = generateSignature(endpoint, data);
  
  try {
    const response = await axios({
      method,
      url: `${FIXEDFLOAT_CONFIG.baseURL}${endpoint}`,
      data: data || undefined,
      headers: {
        'X-API-KEY': FIXEDFLOAT_CONFIG.apiKey,
        'X-API-SIGN': signature
      }
    });
    return response.data;
  } catch (error) {
    console.error('FixedFloat API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Proxy endpoints
app.post('/api/fixedfloat/getPrice', async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const result = await makeFixedFloatRequest('POST', '/getPrice', data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fixedfloat/createOrder', async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const result = await makeFixedFloatRequest('POST', '/createOrder', data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
