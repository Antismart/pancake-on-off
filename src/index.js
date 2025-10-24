import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    if (process.env.DB_URI) {
      await mongoose.connect(process.env.DB_URI, {
        // useNewUrlParser/UnifiedTopology not required in newer mongoose
      });
      logger.info('Connected to MongoDB');
    } else {
      logger.warn('DB_URI not set - running without DB persistence');
    }

    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start', err);
    process.exit(1);
  }
}

start();
