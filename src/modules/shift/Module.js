import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    perHour: { type: Number, required: true, min: 0 },
    place: { type: String, required: true, trim: true, maxlength: 160 },
  },
  { timestamps: true },
);

shiftSchema.pre('validate', function validateShiftTimes() {
  if (this.start && this.end && this.end <= this.start) {
    this.invalidate('end', 'Shift end must be after shift start.');
  }
});

export const Shift = mongoose.model('Shift', shiftSchema);
