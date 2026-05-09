const mongoose = require('mongoose');

// GET all admissions with pagination and filtering
exports.getAdmissions = async (req, res) => {
  try {
    const Admission = mongoose.model('Application');
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
};

// GET admission by ID
exports.getAdmissionById = async (req, res) => {
  try {
    const Admission = mongoose.model('Application');
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
};

// UPDATE admission status
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const Admission = mongoose.model('Application');
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
};

// DELETE admission
exports.deleteAdmission = async (req, res) => {
  try {
    const Admission = mongoose.model('Application');
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
};

// POST create admission
exports.createAdmission = async (req, res) => {
  try {
    const Admission = mongoose.model('Application');
    console.log('📨 Received admission form data');
    const requiredFields = [
      'name', 'dob', 'motherTongue', 'caste', 'religion',
      'previousClass', 'admissionClass', 'previousSchool', 'admissionDate',
      'fatherName', 'motherName', 'fatherContact', 'email',
      'occupation', 'address', 'declaration'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const admissionData = {
      name: req.body.name.trim(),
      dob: new Date(req.body.dob),
      motherTongue: req.body.motherTongue,
      caste: req.body.caste.trim(),
      religion: req.body.religion,
      previousClass: req.body.previousClass,
      admissionClass: req.body.admissionClass,
      previousSchool: req.body.previousSchool.trim(),
      admissionDate: new Date(req.body.admissionDate),
      fatherName: req.body.fatherName.trim(),
      motherName: req.body.motherName.trim(),
      fatherContact: req.body.fatherContact.replace(/\D/g, ''),
      motherContact: req.body.motherContact ? req.body.motherContact.replace(/\D/g, '') : '',
      email: req.body.email.toLowerCase().trim(),
      occupation: req.body.occupation.trim(),
      motherOccupation: req.body.motherOccupation ? req.body.motherOccupation.trim() : '',
      address: req.body.address.trim(),
      declaration: req.body.declaration === 'true' || req.body.declaration === true,
      submittedAt: new Date()
    };

    if (isNaN(admissionData.dob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth' });
    }
    if (isNaN(admissionData.admissionDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid admission date' });
    }

    const age = new Date().getFullYear() - admissionData.dob.getFullYear();
    if (age < 3) {
      return res.status(400).json({ success: false, message: 'Student must be at least 3 years old for admission' });
    }

    const newAdmission = new Admission(admissionData);
    const savedAdmission = await newAdmission.save();
    console.log('✅ Admission saved:', savedAdmission.applicationNumber);

    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully!',
      data: savedAdmission,
      applicationNumber: savedAdmission.applicationNumber
    });
  } catch (error) {
    console.error('❌ Error saving admission:', error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate application. Please try again.' });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ success: false, message: 'Error submitting form', error: error.message });
  }
};
