import { HttpError } from '../../utils/HttpError.js';
import { User } from '../user/Module.js';
import { Shift } from './Module.js';

export async function getAllShifts(req, res) {
  if (req.auth.role !== 'admin') {
    throw new HttpError(403, 'Only administrators can list all shifts.');
  }

  const shifts = await Shift.find().populate('userId', 'firstname lastname email');
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
  const requestedUserId = req.body._id || req.auth.userId;
  if (req.auth.role !== 'admin' && requestedUserId !== req.auth.userId) {
    throw new HttpError(403, 'You can only create shifts for your own account.');
  }
  if (!(await User.exists({ _id: requestedUserId }))) {
    throw new HttpError(404, 'User for this shift was not found.');
  }

  const shift = await Shift.create({ ...req.body.shift, userId: requestedUserId });
  res.status(201).json({ shift });
}

export async function updateShiftById(req, res) {
  const id = req.params.id || req.body._id;
  const shift = await Shift.findById(id);
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
  const shift = await Shift.findByIdAndDelete(req.params.id || req.body._id);
  if (!shift) {
    throw new HttpError(404, 'Shift not found.');
  }
  res.status(204).send();
}
