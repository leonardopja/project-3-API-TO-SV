import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  login,
  register,
  updateUser,
} from './Controller.js';

const router = Router();
const authRouter = Router();
const email = z.string().email().max(254);
const password = z.string().min(8).max(128);
const registrationSchema = z.object({
  user: z.object({
    email,
    password,
    firstname: z.string().trim().min(1).max(80),
    lastname: z.string().trim().min(1).max(80),
  }).strict(),
}).strict();
const loginSchema = z.object({ email, password }).strict();
const updateSchema = z.object({
  user: z.object({
    email: email.optional(),
    firstname: z.string().trim().min(1).max(80).optional(),
    lastname: z.string().trim().min(1).max(80).optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
}).strict();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

authRouter.post('/register', validate(registrationSchema), asyncHandler(register));
authRouter.post('/login', validate(loginSchema), asyncHandler(login));

router.get('/me', authenticate, asyncHandler(getCurrentUser));
router.get('/', authenticate, authorize('admin'), asyncHandler(getAllUsers));
router.patch('/:id', authenticate, validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateUser));
router.delete('/:id', authenticate, authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteUser));

export { authRouter };
export default router;
