import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { seedDefaultPermissions, Permission } from '../modules/permission/Module.js';
import { User } from '../modules/user/Module.js';

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRSTNAME, ADMIN_LASTNAME } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_FIRSTNAME || !ADMIN_LASTNAME) {
  throw new Error('Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRSTNAME and ADMIN_LASTNAME in .env.');
}
if (ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
}

try {
  await connectDatabase();
  await seedDefaultPermissions();

  const existingUser = await User.findOne({ email: ADMIN_EMAIL });
  if (existingUser) {
    throw new Error('A user with ADMIN_EMAIL already exists; refusing to change its role.');
  }

  const permission = await Permission.findOne({ description: 'admin' });
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = await User.create({
    email: ADMIN_EMAIL,
    password,
    firstname: ADMIN_FIRSTNAME,
    lastname: ADMIN_LASTNAME,
    permission: permission.id,
  });

  console.log(`Administrator created: ${user.email}`);
} catch (error) {
  console.error('Failed to create administrator:', error);
  process.exitCode = 1;
} finally {
  const mongoose = await import('mongoose');
  await mongoose.default.disconnect();
}
