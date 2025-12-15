const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get the already defined Application model
const Admission = mongoose.model('Application');

// Middleware to check admin authentication
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing'
    });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  
  if (token !== 'adminToken123') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  next();
};
// CREATE admission (PUBLIC - NO AUTH)
router.post('/', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();

    res.status(201).json({
      success: true,
      message: 'Admission submitted successfully',
      data: admission
    });
  } catch (error) {
    console.error('❌ Error creating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting admission',
      error: error.message
    });
  }
});


// GET all admissions with pagination and filtering
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-submittedAt' } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { fatherContact: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [admissions, total] = await Promise.all([
      Admission.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Admission.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: admissions.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: admissions
    });
  } catch (error) {
    console.error('❌ Error fetching admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
});

// GET admission by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID format'
      });
    }
    
    const admission = await Admission.findById(id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('❌ Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
});

// UPDATE admission status - FIXED ROUTE
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    console.log(`Updating admission ${id} to status: ${status}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID'
      });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: `Admission ${status} successfully`,
      data: updatedAdmission
    });
  } catch (error) {
    console.error('❌ Error updating admission status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admission status',
      error: error.message
    });
  }
});

// DELETE admission
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting admission ${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID'
      });
    }
    
    const deletedAdmission = await Admission.findByIdAndDelete(id);
    
    if (!deletedAdmission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Admission deleted successfully',
      data: { id: deletedAdmission._id }
    });
  } catch (error) {
    console.error('❌ Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message
    });
  }
});

module.exports = router;
