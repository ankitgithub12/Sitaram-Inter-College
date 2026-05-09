const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const GalleryPhoto = mongoose.model('GalleryPhoto');

// Configure Cloudinary storage for gallery
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_site/gallery',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.png') return 'png';
      if (ext === '.webp') return 'webp';
      if (ext === '.gif') return 'gif';
      return 'jpg';
    },
    public_id: (req, file) => {
      return `gallery-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    },
    transformation: [
      { quality: 'auto:good' } // keeping original size mostly, optimizing quality
    ]
  }
});

exports.uploadMiddleware = multer({ 
  storage: cloudinaryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed in gallery'), false);
    }
  }
});

// GET all active photos
exports.getGallery = async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    let photosQuery = GalleryPhoto.find(query).sort({ uploadedAt: -1 });
    if (limit) {
      photosQuery = photosQuery.limit(parseInt(limit));
    }

    const photos = await photosQuery;
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery', error: error.message });
  }
};

// POST upload photo (admin)
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo provided' });
    }

    const newPhoto = new GalleryPhoto({
      title: req.body.title || 'Untitled',
      description: req.body.description || '',
      category: req.body.category || 'general',
      cloudinaryPublicId: req.file.filename,
      secureUrl: req.file.path,
      format: req.file.mimetype?.split('/')[1] || 'jpg',
      bytes: req.file.size,
      isActive: true
    });

    const savedPhoto = await newPhoto.save();
    res.status(201).json({ success: true, data: savedPhoto, message: 'Photo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

// PUT update photo details
exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updatedPhoto = await GalleryPhoto.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedPhoto) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.json({ success: true, data: updatedPhoto, message: 'Photo updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// DELETE photo
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await GalleryPhoto.findById(id);

    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });

    if (photo.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
    }

    await GalleryPhoto.findByIdAndDelete(id);
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};
