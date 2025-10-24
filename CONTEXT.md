You are a senior backend engineer with strong experience in Node.js, Express, Hedera SDK, webhooks, and fintech API integration.
Build a production-grade backend service that allows users to onramp and offramp between USDC (on Hedera) and KES (via Pretium API).
The code should follow clean architecture principles, modular separation, and production best practices (error handling, environment variables, async/await, logging, etc).

🎯 Project Goal

We’re building a Node.js + Express backend that:

Lets users deposit KES (M-Pesa) via Pretium /kes/collect → receives USDC on Hedera.

Lets users withdraw USDC → triggers Pretium /kes/disburse → receives KES in M-Pesa.

Integrates cleanly with Hedera SDK, Pretium APIs, and supports webhook callbacks.

Is structured like a scalable microservice (controllers, services, config, routes).

🧩 Functional Requirements
🔹 Onramp Flow (KES → USDC)

User provides:

amount in KES

mobile_network (e.g. “Safaricom”)

phone or shortcode

hedera_account_id

Backend calls POST /kes/collect to Pretium.

On Pretium callback (/callbacks/collect):

Verify status === "SUCCESS".

Fetch USD/KES FX rate.

Compute equivalent USDC.

Send USDC from treasury wallet to user’s Hedera account using the Hedera SDK.

Record transaction in DB.

🔹 Offramp Flow (USDC → KES)

User sends USDC to an escrow wallet on Hedera.

Backend monitors escrow via Hedera Mirror Node API.

When detected:

Compute KES equivalent.

Call POST /kes/disburse on Pretium.

Wait for Pretium callback (/callbacks/disburse) → mark complete.

Record all steps in DB.

⚙️ Technical Stack

Node.js (v18+)

Express.js

Axios (for Pretium and FX APIs)

@hashgraph/sdk (for USDC transfers)

dotenv (for config)

Mongoose or Prisma (for persistence)

Winston or Pino (for logging)

 

🪙 Hedera Configuration
// src/config/hedera.js
import { Client } from "@hashgraph/sdk";

export const client = Client.forMainnet().setOperator(
  process.env.OPERATOR_ID,
  process.env.OPERATOR_KEY
);

export const USDC_TOKEN_ID = "0.0.456858"; // Hedera mainnet

🌍 Pretium Integration

Use endpoints:

POST /kes/collect → Collect payments

POST /kes/disburse → Send disbursements

Callback URLs for both flows.

Docs: https://docs.pretium.co.ke

Example payloads:

Collect:

{
  "shortcode": "0743312265",
  "amount": "1000",
  "mobile_network": "Safaricom",
  "callback_url": "https://yourapi.com/callbacks/collect"
}


Disburse:

{
  "amount": "60000",
  "shortcode": "522522",
  "account_number": "13352",
  "type": "PAYBILL",
  "mobile_network": "Safaricom",
  "callback_url": "https://yourapi.com/callbacks/disburse"
}

⚙️ Environment Variables
PORT=3000
APP_URL=https://yourapi.com

OPERATOR_ID=0.0.xxxxx
OPERATOR_KEY=302e020100300506032b6570...
USDC_TOKEN_ID=0.0.456858

PRETIUM_BASE_URL=https://api.pretium.co.ke
PRETIUM_API_KEY=your_api_key_here

DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/onofframp
FX_API_URL=https://open.er-api.com/v6/latest/USD

🧮 FX Conversion Logic

Fetch live USD/KES rate.

Round to 2 decimal places.

Apply configurable fee margin:

const margin = 0.015; // 1.5%
const rateWithMargin = usdKesRate * (1 - margin);

🔒 Security & Reliability

Validate Pretium callbacks with HMAC signatures (if provided).

Store Pretium + Hedera TXIDs for reconciliation.

Include retry logic for Pretium and Mirror Node polling.

Add health route (/healthz).

Implement global error handler middleware.

✅ Deliverables

Fully functional backend that can:

Receive deposits via Pretium (/onramp)

Handle Pretium callbacks

Send USDC using Hedera SDK

Watch for inbound USDC to trigger disbursements

Handle /offramp and /callbacks/disburse

Well-structured code, clean modular design.

Clear README with setup steps and .env example.

Ready to deploy on services like Render, Railway, or AWS Lambda.

🧑‍💻 Coding Style Expectations

Use async/await (no .then() chaining)

Use consistent error handling via custom ApiError class.

Descriptive variable names and comments for all business logic.

Use ES modules ("type": "module" in package.json).

Linting (ESLint + Prettier config optional).