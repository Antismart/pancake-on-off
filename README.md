# Pancake On/Off - Backend Service

This repository contains a Node.js + Express backend that implements onramp and offramp flows between USDC (Hedera) and KES (via Pretium API).

Key features implemented in scaffold:
- /onramp endpoint to initiate Pretium collect
- /offramp endpoint to record expected offramps
- /callbacks/collect and /callbacks/disburse to handle Pretium webhooks
- Hedera service to send USDC (requires OPERATOR keys)
- FX service to fetch USD/KES rate and apply margin
- Mongoose model for recording transactions
- Health endpoint at /healthz

Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install deps:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

Notes
- This is a scaffold implementing core flow logic and should be extended for production: better retry logic, mirror node polling for escrow detection, HMAC signature configuration per Pretium docs, more robust Hedera token decimals handling, and tests.
# pancake-on-off
