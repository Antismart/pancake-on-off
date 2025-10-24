import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

const app = express();

// capture raw body for signature validation middleware
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// global error handler
app.use(errorHandler);

export default app;
