import axios from 'axios';
import { PRETIUM_BASE_URL, PRETIUM_API_KEY } from '../config/pretium.js';

const client = axios.create({
  baseURL: PRETIUM_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PRETIUM_API_KEY}`,
  },
  timeout: 10_000,
});

export async function createCollect(payload) {
  const res = await client.post('/kes/collect', payload);
  return res.data;
}

export async function createDisburse(payload) {
  const res = await client.post('/kes/disburse', payload);
  return res.data;
}
