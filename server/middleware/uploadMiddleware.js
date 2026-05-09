const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Storage for Faculty/Teacher Photos
const facultyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_site/faculty',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.png') return 'png';
      if (ext === '.webp') return 'webp';
      return 'jpg';
    },
    public_id: (req, file) => {
      return `teacher-${Date.now()}`;
    },
    transformation: [
      { width: 500, height: 600, crop: 'fill', gravity: 'face', quality: 'auto' }
    ]
  }
});

const uploadFaculty = multer({
  storage: facultyStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

module.exports = { uploadFaculty };
