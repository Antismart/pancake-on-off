import express from 'express';
import { onramp } from '../controllers/onrampController.js';
import { offramp } from '../controllers/offrampController.js';
import { collectCallback, disburseCallback } from '../controllers/callbacksController.js';

const router = express.Router();

router.post('/onramp', onramp);
router.post('/offramp', offramp);

// Pretium callbacks
router.post('/callbacks/collect', collectCallback);
router.post('/callbacks/disburse', disburseCallback);

export default router;
