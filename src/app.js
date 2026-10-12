import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import commentRoutes from './modules/comment/Route.js';
import permissionRoutes from './modules/permission/Route.js';
import shiftRoutes from './modules/shift/Route.js';
import authRoutes from './modules/user/AuthRoute.js';
import userRoutes from './modules/user/Route.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { env } from './config/env.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? '*' : env.corsOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/permission', permissionRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
