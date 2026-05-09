const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');

router.get('/', achievementsController.getAchievements);

// Uses multer middleware to handle certificate upload if provided
router.post('/', achievementsController.uploadCertificate.single('certificate'), achievementsController.createAchievement);
router.put('/:id', achievementsController.uploadCertificate.single('certificate'), achievementsController.updateAchievement);
router.delete('/:id', achievementsController.deleteAchievement);

module.exports = router;
