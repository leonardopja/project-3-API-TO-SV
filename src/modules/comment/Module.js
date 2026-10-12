import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const Comment = mongoose.model('Comment', commentSchema);
