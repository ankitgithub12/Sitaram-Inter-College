const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');

// Middleware to check admin authentication
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  
  if (!token || (!token.startsWith('token_admin_') && token !== 'adminToken123')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
  
  next();
};

router.get('/', authenticateAdmin, admissionController.getAdmissions);
router.get('/public/:id', admissionController.getAdmissionById);
router.get('/:id', authenticateAdmin, admissionController.getAdmissionById);
router.put('/:id/status', authenticateAdmin, admissionController.updateAdmissionStatus);
router.delete('/:id', authenticateAdmin, admissionController.deleteAdmission);
// Public route for form submission
router.post('/', admissionController.createAdmission);

module.exports = router;