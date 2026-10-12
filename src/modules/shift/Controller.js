import { HttpError } from '../../utils/HttpError.js';
import { Shift } from './Module.js';

export async function getAllShifts(req, res) {
  const filter = req.auth.role === 'admin' ? {} : { userId: req.auth.userId };
  const shifts = await Shift.find(filter).populate('userId', 'firstname lastname email');
  res.json({ shifts });
}

export async function getShiftById(req, res) {
  const shift = await Shift.findById(req.params.id).populate('userId', 'firstname lastname email');
  if (!shift) {
    throw new HttpError(404, 'Shift not found.');
  }
  if (req.auth.role !== 'admin' && shift.userId.id !== req.auth.userId) {
    throw new HttpError(403, 'You can only view your own shifts.');
  }
  res.json({ shift });
}

export async function addShift(req, res) {
  const shift = await Shift.create({ ...req.body.shift, userId: req.auth.userId });
  res.status(201).json({ shift });
}

export async function updateShiftById(req, res) {
  const shift = await Shift.findById(req.params.id);
  if (!shift) {
    throw new HttpError(404, 'Shift not found.');
  }
  if (req.auth.role !== 'admin' && shift.userId.toString() !== req.auth.userId) {
    throw new HttpError(403, 'You can only update your own shifts.');
  }

  Object.assign(shift, req.body.shift);
  await shift.save();
  res.json({ shift });
}

export async function deleteShift(req, res) {
  const shift = await Shift.findByIdAndDelete(req.params.id);
  if (!shift) {
    throw new HttpError(404, 'Shift not found.');
  }
  res.status(204).send();
}
