import { Client } from '@hashgraph/sdk';

const operatorId = process.env.OPERATOR_ID;
const operatorKey = process.env.OPERATOR_KEY;

let _client;
let _operatorConfigured = false;

if (!operatorId || !operatorKey) {
  console.warn('OPERATOR_ID or OPERATOR_KEY not set; Hedera operations will fail until configured');
  _client = Client.forMainnet();
  _operatorConfigured = false;
} else {
  _client = Client.forMainnet().setOperator(operatorId, operatorKey);
  _operatorConfigured = true;
}

export const client = _client;
export const OPERATOR_CONFIGURED = _operatorConfigured;

export const USDC_TOKEN_ID = process.env.USDC_TOKEN_ID || '0.0.456858';
