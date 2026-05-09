const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { Testimonial } = require('../models');

// Cloudinary storage for testimonial photos
const testimonialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sric_testimonials',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
  }
});

const upload = multer({
  storage: testimonialStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// GET all active testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET all testimonials (admin, including inactive)
router.get('/all', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST create testimonial
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, designation, batch, content, rating } = req.body;
    if (!name || !content) {
      return res.status(400).json({ success: false, message: 'Name and content are required' });
    }

    const testimonialData = {
      name,
      designation: designation || '',
      batch: batch || '',
      content,
      rating: rating ? parseInt(rating) : 5,
      isActive: true
    };

    if (req.file) {
      testimonialData.photoUrl = req.file.path;
      testimonialData.photoPublicId = req.file.filename;
    }

    const testimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add testimonial', error: err.message });
  }
});

// PATCH toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    res.json({ success: true, data: testimonial, message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    // Delete image from Cloudinary if exists
    if (testimonial.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(testimonial.photoPublicId);
      } catch (cloudErr) {
        console.error('Error deleting Cloudinary image:', cloudErr);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
