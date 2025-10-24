export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  // minimal error response - in prod hide details
  console.error(err);
  res.status(status).json({ error: message });
}
