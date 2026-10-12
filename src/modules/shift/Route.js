import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  addShift,
  deleteShift,
  getAllShifts,
  getShiftById,
  updateShiftById,
} from './Controller.js';

const router = Router();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });
const bodyIdSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
  user: z.record(z.string(), z.unknown()).optional(),
}).strict();
const shiftFields = {
  start: z.coerce.date(),
  end: z.coerce.date(),
  perHour: z.number().finite().min(0),
  place: z.string().trim().min(1).max(160),
};
const createSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  shift: z.object(shiftFields).strict(),
}).strict();
const updateSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  shift: z.object({
    start: shiftFields.start.optional(),
    end: shiftFields.end.optional(),
    perHour: shiftFields.perHour.optional(),
    place: shiftFields.place.optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
}).strict();
const collectionUpdateSchema = updateSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
});

const getShiftCollectionItem = asyncHandler(async (req, res) => {
  const id = req.query._id || req.body?._id;
  if (id) {
    const parsedId = idSchema.safeParse({ id });
    if (!parsedId.success) {
      return res.status(400).json({ error: 'Invalid request data.', details: parsedId.error.issues });
    }
    req.params.id = parsedId.data.id;
    return getShiftById(req, res);
  }
  return getAllShifts(req, res);
});

router.use(authenticate);
router.get('/', getShiftCollectionItem);
router.get('/:id', validate(idSchema, 'params'), asyncHandler(getShiftById));
router.post('/', validate(createSchema), asyncHandler(addShift));
router.patch('/', validate(collectionUpdateSchema), asyncHandler(updateShiftById));
router.patch('/:id', validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateShiftById));
router.delete('/', authorize('admin'), validate(bodyIdSchema), asyncHandler(deleteShift));
router.delete('/:id', authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteShift));

export default router;
