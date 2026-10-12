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
const bodyIdSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
  user: z.record(z.string(), z.unknown()).optional(),
}).strict();
const createSchema = z.object({
  comment: z.object({ description: z.string().trim().min(1).max(2000) }).strict(),
}).strict();
const updateSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  comment: z.object({ description: z.string().trim().min(1).max(2000) }).strict(),
}).strict();
const collectionUpdateSchema = updateSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
});

router.use(authenticate);
router.get('/', authorize('admin'), asyncHandler(getAllComments));
router.get('/user/:userId', validate(userIdSchema, 'params'), asyncHandler(getAllUserComments));
router.get('/:id', validate(idSchema, 'params'), asyncHandler(getCommentById));
router.post('/', validate(createSchema), asyncHandler(createComment));
router.patch('/', validate(collectionUpdateSchema), asyncHandler(updateCommentById));
router.patch('/:id', validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateCommentById));
router.delete('/', authorize('admin'), validate(bodyIdSchema), asyncHandler(deleteComment));
router.delete('/:id', authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteComment));

export default router;
