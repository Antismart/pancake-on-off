import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['onramp', 'offramp'], required: true },
  amountKES: { type: Number },
  amountUSD: { type: Number },
  fxRate: { type: Number },
  status: { type: String, default: 'pending' },
  pretiumTxId: { type: String },
  hederaTxId: { type: String },
  metadata: { type: Object },
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
