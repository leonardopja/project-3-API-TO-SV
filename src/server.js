import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedDefaultPermissions } from './modules/permission/Module.js';

try {
  await connectDatabase();
  await seedDefaultPermissions();

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
} catch (error) {
  console.error('Failed to start API:', error);
  process.exitCode = 1;
}
