import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
} from './Controller.js';

const router = Router();
const email = z.string().email().max(254);
const updateSchema = z.object({
  user: z.object({
    email: email.optional(),
    firstname: z.string().trim().min(1).max(80).optional(),
    lastname: z.string().trim().min(1).max(80).optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
}).strict();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

router.get('/me', authenticate, asyncHandler(getCurrentUser));
router.get('/', authenticate, authorize('admin'), asyncHandler(getAllUsers));
router.patch('/:id', authenticate, validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateUser));
router.delete('/:id', authenticate, authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteUser));

export default router;
