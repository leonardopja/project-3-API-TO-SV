import { Permission } from './Module.js';

export async function getAllPermissions(_req, res) {
  const permissions = await Permission.find().sort({ description: 1 });
  res.json({ permissions });
}
