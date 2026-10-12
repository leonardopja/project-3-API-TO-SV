import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'Invalid resource identifier.' });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ error: 'A record with this value already exists.' });
  }

  console.error(error);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
}
