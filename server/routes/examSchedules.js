const express = require('express');
const router = express.Router();
const ExamSchedule = require('../models/examSchedules');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all exam schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await ExamSchedule.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET single exam schedule
router.get('/:id', async (req, res) => {
  try {
    const schedule = await ExamSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// POST new exam schedule
// Accept an optional file upload "pdfFile"
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, examType, academicYear, status, noticeText, colorTheme } = req.body;
    let dates = [];
    if (req.body.dates) {
      // It might come as a stringified JSON if FormData is used
      dates = typeof req.body.dates === 'string' ? JSON.parse(req.body.dates) : req.body.dates;
    }

    let pdfUrl = req.body.pdfUrl || '';

    // Handle file upload if present
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'sric/exams',
          resource_type: 'auto'
        });
        pdfUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed", uploadError);
        // Continue but without the file
      }
    }

    const schedule = await ExamSchedule.create({
      title,
      examType,
      academicYear,
      status,
      noticeText,
      dates,
      colorTheme,
      pdfUrl
    });

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error("Create schedule error:", error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
});

// PUT update exam schedule
router.put('/:id', upload.single('pdfFile'), async (req, res) => {
  try {
    let schedule = await ExamSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Prepare update data
    const updateData = { ...req.body };
    if (req.body.dates) {
      updateData.dates = typeof req.body.dates === 'string' ? JSON.parse(req.body.dates) : req.body.dates;
    }

    // Handle new file upload if present
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'sric/exams',
        resource_type: 'auto'
      });
      updateData.pdfUrl = uploadResponse.secure_url;
    }

    schedule = await ExamSchedule.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
});

// DELETE exam schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await ExamSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.status(200).json({ success: true, message: 'Schedule removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
