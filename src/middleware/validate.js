import { HttpError } from '../utils/HttpError.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new HttpError(400, 'Invalid request data.', result.error.issues));
    }

    req[source] = result.data;
    return next();
  };
}
