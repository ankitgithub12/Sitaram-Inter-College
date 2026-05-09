const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// In a real app we would add authMiddleware for POST/PUT/DELETE
// Public route
router.get('/', galleryController.getGallery);

// Admin routes (assuming front-end protection, but should have middleware ideally)
router.post('/upload', galleryController.uploadMiddleware.single('photo'), galleryController.uploadPhoto);
router.put('/:id', galleryController.updatePhoto);
router.delete('/:id', galleryController.deletePhoto);

module.exports = router;
