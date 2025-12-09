
const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission'); // You'll need to create this model

// GET all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ submittedAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new admission
router.post('/', async (req, res) => {
  try {
    // Format dates
    const admissionData = {
      ...req.body,
      dob: new Date(req.body.dob),
      admissionDate: new Date(req.body.admissionDate),
      declaration: req.body.declaration === 'true' || req.body.declaration === true,
      submittedAt: new Date()
    };

    const newAdmission = new Admission(admissionData);
    const savedAdmission = await newAdmission.save();
    
    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully!',
      data: savedAdmission
    });
  } catch (error) {
    console.error('Error saving admission:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error submitting form',
      error: error.message 
    });
  }
});

// GET admission by ID
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE admission status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: admission
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE admission
router.delete('/:id', async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Admission deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
