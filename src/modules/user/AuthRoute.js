import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { login, register } from './Controller.js';

const router = Router();
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

router.post('/register', validate(registrationSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));

export default router;
