import { createCollect } from '../services/pretiumService.js';
import { Transaction } from '../models/transaction.model.js';

export async function onramp(req, res, next) {
  try {
    const { amount, mobile_network, phone, hedera_account_id } = req.body;
    if (!amount || !mobile_network || !phone || !hedera_account_id) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    const payload = {
      shortcode: phone,
      amount: String(amount),
      mobile_network,
      callback_url: `${process.env.APP_URL}/callbacks/collect`,
    };

    const resData = await createCollect(payload);

    // record transaction (will be updated on callback)
    const tx = await Transaction.create({
      type: 'onramp',
      amountKES: Number(amount),
      status: 'collect_initiated',
      pretiumTxId: resData?.id || resData?.reference || undefined,
      metadata: { raw: resData, hedera_account_id },
    });

    return res.json({ ok: true, data: resData, txId: tx._id });
  } catch (err) {
    next(err);
  }
}
