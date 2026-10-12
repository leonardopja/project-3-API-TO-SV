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
const shiftFields = {
  start: z.coerce.date(),
  end: z.coerce.date(),
  perHour: z.number().finite().min(0),
  place: z.string().trim().min(1).max(160),
};
const createSchema = z.object({ shift: z.object(shiftFields).strict() }).strict();
const updateSchema = z.object({
  shift: z.object({
    start: shiftFields.start.optional(),
    end: shiftFields.end.optional(),
    perHour: shiftFields.perHour.optional(),
    place: shiftFields.place.optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
}).strict();

router.use(authenticate);
router.get('/', asyncHandler(getAllShifts));
router.get('/:id', validate(idSchema, 'params'), asyncHandler(getShiftById));
router.post('/', validate(createSchema), asyncHandler(addShift));
router.patch('/:id', validate(idSchema, 'params'), validate(updateSchema), asyncHandler(updateShiftById));
router.delete('/:id', authorize('admin'), validate(idSchema, 'params'), asyncHandler(deleteShift));

export default router;
