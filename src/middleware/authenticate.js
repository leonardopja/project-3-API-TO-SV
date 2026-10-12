import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../modules/user/Module.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authorization = req.get('authorization');
  const [scheme, token] = authorization?.split(' ') || [];

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'A valid Bearer token is required.');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, 'The authentication token is invalid or expired.');
  }

  const user = await User.findById(payload.sub).populate('permission');
  if (!user) {
    throw new HttpError(401, 'The account for this token no longer exists.');
  }

  req.auth = {
    userId: user.id,
    role: user.permission.description,
  };
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new HttpError(403, 'You do not have permission to perform this action.'));
    }

    return next();
  };
}
