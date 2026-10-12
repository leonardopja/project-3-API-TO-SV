import test from 'node:test';
import assert from 'node:assert/strict';
import { Comment } from '../src/modules/comment/Module.js';
import { Permission } from '../src/modules/permission/Module.js';
import { Shift } from '../src/modules/shift/Module.js';
import { User } from '../src/modules/user/Module.js';

test('user model requires identity, password and permission fields', async () => {
  const user = new User({});
  const error = await user.validate().catch((validationError) => validationError);

  assert.ok(error);
  assert.ok(error.errors.email);
  assert.ok(error.errors.password);
  assert.ok(error.errors.firstname);
  assert.ok(error.errors.lastname);
  assert.ok(error.errors.permission);
  assert.equal(User.schema.path('password').options.select, false);
});

test('shift model rejects an end time before its start time', async () => {
  const shift = new Shift({
    userId: '507f1f77bcf86cd799439011',
    start: '2026-10-12T17:00:00.000Z',
    end: '2026-10-12T09:00:00.000Z',
    perHour: 20,
    place: 'Office',
  });
  const error = await shift.validate().catch((validationError) => validationError);

  assert.ok(error);
  assert.match(error.errors.end.message, /after shift start/);
});

test('comment model requires a user and a non-empty description', async () => {
  const comment = new Comment({ description: '  ' });
  const error = await comment.validate().catch((validationError) => validationError);

  assert.ok(error);
  assert.ok(error.errors.userId);
  assert.ok(error.errors.description);
});

test('permission model only accepts the specified roles', async () => {
  const permission = new Permission({ description: 'superuser' });
  const error = await permission.validate().catch((validationError) => validationError);

  assert.ok(error);
  assert.ok(error.errors.description);
});
