import { Comment } from './Module.js';
import { HttpError } from '../../utils/HttpError.js';
import { User } from '../user/Module.js';

export async function getAllComments(_req, res) {
  const comments = await Comment.find().populate('userId', 'firstname lastname email');
  res.json({ comments });
}

export async function getCommentById(req, res) {
  const comment = await Comment.findById(req.params.id).populate('userId', 'firstname lastname email');
  if (!comment) {
    throw new HttpError(404, 'Comment not found.');
  }
  if (req.auth.role !== 'admin' && comment.userId.id !== req.auth.userId) {
    throw new HttpError(403, 'You can only view your own comments.');
  }
  res.json({ comment });
}

export async function createComment(req, res) {
  const comment = await Comment.create({
    ...req.body.comment,
    userId: req.auth.userId,
  });
  await User.findByIdAndUpdate(req.auth.userId, { $addToSet: { comments: comment.id } });
  res.status(201).json({ comment });
}

export async function updateCommentById(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new HttpError(404, 'Comment not found.');
  }
  if (req.auth.role !== 'admin' && comment.userId.toString() !== req.auth.userId) {
    throw new HttpError(403, 'You can only update your own comments.');
  }

  comment.description = req.body.comment.description;
  await comment.save();
  res.json({ comment });
}

export async function deleteComment(req, res) {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) {
    throw new HttpError(404, 'Comment not found.');
  }
  await User.findByIdAndUpdate(comment.userId, { $pull: { comments: comment.id } });
  res.status(204).send();
}

export async function getAllUserComments(req, res) {
  if (req.auth.role !== 'admin' && req.auth.userId !== req.params.userId) {
    throw new HttpError(403, 'You can only view comments created by your account.');
  }

  const comments = await Comment.find({ userId: req.params.userId })
    .populate('userId', 'firstname lastname email');
  res.json({ comments });
}
