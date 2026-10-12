import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { HttpError } from '../../utils/HttpError.js';
import { Permission } from '../permission/Module.js';
import { User } from './Module.js';

const publicUserFields = 'email firstname lastname permission comments createdAt updatedAt';

function issueToken(user) {
  return jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(req, res) {
  const { email, password, firstname, lastname } = req.body.user;
  const permission = await Permission.findOne({ description: 'regular_user' });
  if (!permission) {
    throw new HttpError(500, 'Default user permission is not configured.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashedPassword,
    firstname,
    lastname,
    permission: permission.id,
  });

  res.status(201).json({
    user: await User.findById(user.id).select(publicUserFields).populate('permission'),
    token: issueToken(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password').populate('permission');
  const passwordMatches = user && (await bcrypt.compare(password, user.password));

  if (!passwordMatches) {
    throw new HttpError(401, 'Email or password is incorrect.');
  }

  res.json({
    user: await User.findById(user.id).select(publicUserFields).populate('permission'),
    token: issueToken(user),
  });
}

export async function getCurrentUser(req, res) {
  const user = await User.findById(req.auth.userId)
    .select(publicUserFields)
    .populate('permission');
  res.json({ user });
}

export async function getAllUsers(_req, res) {
  const users = await User.find().select(publicUserFields).populate('permission');
  res.json({ users });
}

export async function updateUser(req, res) {
  const userId = req.params.id;
  if (req.auth.role !== 'admin' && req.auth.userId !== userId) {
    throw new HttpError(403, 'You can only update your own account.');
  }

  const user = await User.findByIdAndUpdate(userId, req.body.user, {
    new: true,
    runValidators: true,
  })
    .select(publicUserFields)
    .populate('permission');

  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  res.json({ user });
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  res.status(204).send();
}
