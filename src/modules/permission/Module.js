import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      enum: ['admin', 'regular_user'],
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Permission = mongoose.model('Permission', permissionSchema);

export async function seedDefaultPermissions() {
  await Promise.all(
    ['admin', 'regular_user'].map((description) =>
      Permission.updateOne(
        { description },
        { $setOnInsert: { description } },
        { upsert: true },
      ),
    ),
  );
}
