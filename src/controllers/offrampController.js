import { Transaction } from '../models/transaction.model.js';

/**
 * Offramp endpoint: user notifies service that they've sent USDC to escrow.
 * In a production system we'd provide an escrow account and watch Mirror Node
 * for incoming transfers. For now we accept an escrow reference and create a record.
 */
export async function offramp(req, res, next) {
  try {
    const { amountUSD, user_hedera_account, mobile_network, phone } = req.body;
    if (!amountUSD || !user_hedera_account || !mobile_network || !phone) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    const tx = await Transaction.create({
      type: 'offramp',
      amountUSD: Number(amountUSD),
      status: 'awaiting_escrow',
      metadata: { user_hedera_account, mobile_network, phone },
    });

    // In docs we'd return escrow account details to the user here.
    return res.json({ ok: true, txId: tx._id, message: 'Record created, will watch escrow for incoming USDC' });
  } catch (err) {
    next(err);
  }
}
