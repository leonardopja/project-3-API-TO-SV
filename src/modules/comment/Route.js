import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createComment,
  deleteComment,
  getAllComments,
  getAllUserComments,
  getCommentById,
  updateCommentById,
} from './Controller.js';

const router = Router();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });
const userIdSchema = z.object({ userId: z.string().regex(/^[a-f\d]{24}$/i) });
const createSchema = z.object({
  comment: z.object({ description: z.string().trim().min(1).max(2000) }).strict(),
}).strict();
const updateSchema = z.object({
  comment: z.object({ description: z.string().trim().min(1).max(2000) }).strict(),
}).strict();

router.use(authenticate);
router.get('/', authorize('admin'), asyncHandler(getAllComments));
router.get('/user/:userId', validate(userIdSchema, 'params'), asyncHandler(getAllUserComments));
router.get('/:id', validate(idSchema, 'params'), asyncHandler(getCommentById));
router.post('/', validate(createSchema), asyncHandler(createComment));
router.patch('/:id', validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateCommentById));
router.delete('/:id', authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteComment));

export default router;
