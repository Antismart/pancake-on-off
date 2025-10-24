import { TransferTransaction, AccountId, TokenId } from '@hashgraph/sdk';
import { client, USDC_TOKEN_ID, OPERATOR_CONFIGURED } from '../config/hedera.js';

/**
 * Send USDC tokens from operator (treasury) to destination Hedera account.
 * amountUsd is a decimal USD amount (e.g., 1.23). Token decimal handling
 * depends on the USDC token (commonly 8 decimals on Hedera); the caller
 * should ensure they pass token units or we convert here.
 */
export async function sendUsdcToAccount(destinationAccountId, amountUsd) {
  if (!OPERATOR_CONFIGURED) {
    throw new Error('Hedera operator not configured (OPERATOR_ID/OPERATOR_KEY)');
  }

  // NOTE: token decimals mapping. For production, fetch token info or
  // configure decimals in env. We'll assume 8 decimals for USDC token.
  const DECIMALS = parseInt(process.env.USDC_DECIMALS || '8', 10);
  const tokenId = TokenId.fromString(USDC_TOKEN_ID);
  const receiver = AccountId.fromString(destinationAccountId);
  const operatorAccount = AccountId.fromString(process.env.OPERATOR_ID);

  const amountUnits = Math.round(Number(amountUsd) * Math.pow(10, DECIMALS));

  const tx = new TransferTransaction()
    .addTokenTransfer(tokenId, operatorAccount, -amountUnits)
    .addTokenTransfer(tokenId, receiver, amountUnits);

  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  return { transactionId: receipt.transactionId?.toString(), status: receipt.status?.toString() };
}

/**
 * Placeholder for watching escrow transactions - in production this would
 * poll Mirror Node or use websockets. Here we export a helper stub.
 */
export async function watchEscrow(/* options */) {
  // Implement mirror node polling with retry logic in production
  throw new Error('watchEscrow not implemented');
}
