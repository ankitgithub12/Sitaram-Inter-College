const mongoose = require('mongoose');
const { Attendance } = require('../models');

// SUBMIT attendance (bulk upsert)
exports.submitAttendance = async (req, res) => {
  try {
    const { records, teacherId, class: className, date } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid records format' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const ops = records.map(record => ({
      updateOne: {
        filter: { studentId: record.studentId, date: attendanceDate },
        update: {
          $set: {
            teacherId,
            status: record.status,
            class: className,
            submittedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: 'Attendance recorded successfully' });
  } catch (err) {
    console.error('❌ Error saving attendance:', err);
    res.status(500).json({ success: false, message: 'Error saving attendance' });
  }
};

// GET attendance history for a student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Student ID format' });
    }

    const history = await Attendance.find({ studentId: id })
      .sort({ date: -1 })
      .populate('teacherId', 'name subject')
      .lean();

    res.json({ success: true, data: history });
  } catch (err) {
    console.error('❌ Error fetching attendance history:', err);
    res.status(500).json({ success: false, message: 'Error fetching attendance history', error: err.message });
  }
};

// GET attendance report (filtered by class and/or date)
exports.getAttendanceReport = async (req, res) => {
  try {
    const { class: className, date } = req.query;
    let query = {};
    if (className) query.class = className;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      query.date = d;
    }

    const reports = await Attendance.find(query)
      .populate('studentId', 'name username')
      .populate('teacherId', 'name')
      .lean();

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error('❌ Error fetching attendance report:', err);
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
};
