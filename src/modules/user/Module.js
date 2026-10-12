import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    firstname: { type: String, required: true, trim: true, maxlength: 80 },
    lastname: { type: String, required: true, trim: true, maxlength: 80 },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
