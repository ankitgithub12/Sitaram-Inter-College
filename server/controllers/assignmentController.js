const { Assignment } = require('../models');

// GET assignments (filter by teacher if provided)
exports.getAssignments = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = {};
    if (teacherId) query.teacherId = teacherId;
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
};

// GET assignments for students by class
exports.getStudentAssignments = async (req, res) => {
  try {
    const { className } = req.params;
    const assignments = await Assignment.find({
      $or: [
        { className: new RegExp(`^${className}$`, 'i') },
        { className: 'All Classes' }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('❌ Error fetching student assignments:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignments' });
  }
};

// POST create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.status(201).json({ success: true, message: 'Assignment created successfully', data: newAssignment });
  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    res.status(500).json({ success: false, message: 'Error creating assignment', error: error.message });
  }
};

// DELETE assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    res.status(500).json({ success: false, message: 'Error deleting assignment', error: error.message });
  }
};
