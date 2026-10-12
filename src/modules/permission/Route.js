import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { getAllPermissions } from './Controller.js';

const router = Router();

router.get('/', authenticate, asyncHandler(getAllPermissions));

export default router;
