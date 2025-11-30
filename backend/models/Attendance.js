const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day', 'on-leave'],
      default: 'absent',
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    isManualEntry: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate total hours before saving
attendanceSchema.pre('save', function (next) {
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = this.checkOutTime - this.checkInTime;
    this.totalHours = diffMs / (1000 * 60 * 60); // Convert ms to hours
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
