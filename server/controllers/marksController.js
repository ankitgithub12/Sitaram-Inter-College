const { Mark } = require('../models');

exports.getMarks = async (req, res) => {
  try {
    const { teacherUsername } = req.query;
    let query = {};
    if (teacherUsername) query.addedBy = teacherUsername;
    const marks = await Mark.find(query).sort({ date: -1 });
    res.json({ success: true, data: marks });
  } catch (error) {
    console.error('❌ Error fetching marks:', error);
    res.status(500).json({ success: false, message: 'Error fetching marks', error: error.message });
  }
};

exports.getStudentMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.params.studentId }).sort({ date: -1 });
    res.json({ success: true, data: marks });
  } catch (error) {
    console.error('❌ Error fetching student marks:', error);
    res.status(500).json({ success: false, message: 'Error fetching student marks', error: error.message });
  }
};

exports.createMarks = async (req, res) => {
  try {
    const newMark = new Mark(req.body);
    await newMark.save();
    res.status(201).json({ success: true, message: 'Marks added successfully', data: newMark });
  } catch (error) {
    console.error('❌ Error adding marks:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Marks for this subject and exam type already exist for this student'
      });
    }
    res.status(500).json({ success: false, message: 'Error adding marks', error: error.message });
  }
};

exports.updateMarks = async (req, res) => {
  try {
    const updatedMark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMark) return res.status(404).json({ success: false, message: 'Marks entry not found' });
    res.json({ success: true, message: 'Marks updated successfully', data: updatedMark });
  } catch (error) {
    console.error('❌ Error updating marks:', error);
    res.status(500).json({ success: false, message: 'Error updating marks', error: error.message });
  }
};

exports.deleteMarks = async (req, res) => {
  try {
    const deletedMark = await Mark.findByIdAndDelete(req.params.id);
    if (!deletedMark) return res.status(404).json({ success: false, message: 'Marks entry not found' });
    res.json({ success: true, message: 'Marks entry deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting marks:', error);
    res.status(500).json({ success: false, message: 'Error deleting marks', error: error.message });
  }
};
