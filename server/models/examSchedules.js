const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  examType: {
    type: String,
    required: true,
    enum: ['Quarterly', 'Half-Yearly', 'Pre-Board', 'Annual', 'Other']
  },
  academicYear: {
    type: String,
    required: true,
    default: '2026-27'
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  pdfUrl: {
    type: String,
    required: false
  },
  noticeText: {
    type: String,
    required: false
  },
  dates: [{
    date: {
      type: Date,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    classes: {
      type: String,
      required: true
    }
  }],
  colorTheme: {
    type: String,
    enum: ['blue', 'red', 'green', 'purple', 'yellow'],
    default: 'blue'
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
