import crypto from 'crypto';
import { getRateWithMargin } from '../services/fxService.js';
import { sendUsdcToAccount } from '../services/hederaService.js';
import { Transaction } from '../models/transaction.model.js';
import { PRETIUM_HMAC_SECRET } from '../config/pretium.js';

function verifySignature(rawBody, headerSignature) {
  if (!PRETIUM_HMAC_SECRET) return true; // no secret configured
  if (!headerSignature) return false;
  const hmac = crypto.createHmac('sha256', PRETIUM_HMAC_SECRET);
  hmac.update(rawBody);
  const expected = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(headerSignature));
}

export async function collectCallback(req, res, next) {
  try {
    const signature = req.headers['x-pretium-signature'] || req.headers['pretium-signature'];
    if (!verifySignature(req.rawBody || JSON.stringify(req.body), signature)) {
      return res.status(401).json({ error: 'invalid signature' });
    }

    const body = req.body;
    // expected: { status: 'SUCCESS', amount, shortcode, reference, ... }
    if (body.status !== 'SUCCESS') {
      // mark as failed
      await Transaction.create({ type: 'onramp', status: 'collect_failed', metadata: { body } });
      return res.json({ ok: true });
    }

    const amountKES = Number(body.amount);
    const fx = await getRateWithMargin();
    // compute USD equivalent: amountKES / fx
    const amountUSD = Math.round((amountKES / fx) * 100) / 100;

    // send USDC to user Hedera account - we expect hedera_account_id to be supplied in metadata or elsewhere
    const hederaAccount = body.metadata?.hedera_account_id || body.hedera_account_id || (body.callback_reference && body.callback_reference.hedera_account_id);

    let hederaResult = null;
    if (hederaAccount) {
      hederaResult = await sendUsdcToAccount(hederaAccount, amountUSD);
    }

    // record transaction
    await Transaction.create({
      type: 'onramp',
      amountKES,
      amountUSD,
      fxRate: fx,
      status: 'completed',
      pretiumTxId: body.reference || body.id,
      hederaTxId: hederaResult?.transactionId,
      metadata: { rawCallback: body },
    });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function disburseCallback(req, res, next) {
  try {
    const signature = req.headers['x-pretium-signature'] || req.headers['pretium-signature'];
    if (!verifySignature(req.rawBody || JSON.stringify(req.body), signature)) {
      return res.status(401).json({ error: 'invalid signature' });
    }

    const body = req.body;
    if (body.status === 'SUCCESS') {
      await Transaction.create({ type: 'offramp', status: 'completed', pretiumTxId: body.reference || body.id, metadata: { raw: body } });
    } else {
      await Transaction.create({ type: 'offramp', status: 'failed', metadata: { raw: body } });
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
