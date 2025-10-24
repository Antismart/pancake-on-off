import axios from 'axios';

const FX_API_URL = process.env.FX_API_URL || 'https://open.er-api.com/v6/latest/USD';
const MARGIN = parseFloat(process.env.MARGIN || '0.015'); // 1.5% default

export async function getUsdKesRate() {
  const res = await axios.get(FX_API_URL, { timeout: 8000 });
  // expect data.rates.KES or data.rates?.KES depending on provider
  const data = res.data;
  const rate = data?.rates?.KES;
  if (!rate) throw new Error('Unable to fetch USD/KES rate from FX provider');
  return Number(rate);
}

export async function getRateWithMargin() {
  const rate = await getUsdKesRate();
  const rateWithMargin = rate * (1 - MARGIN);
  // round to 2 decimal places per spec
  return Math.round(rateWithMargin * 100) / 100;
}
