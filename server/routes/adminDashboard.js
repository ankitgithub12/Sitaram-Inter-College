const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || (!token.startsWith('token_admin_') && token !== 'adminToken123')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }

  const username = token.split('_')[2];
  req.user = { username, role: 'admin' };
  next();
};

// Routes
router.get('/admin/dashboard', authenticateAdmin, adminDashboardController.getFullAdminDashboardStats);
router.get('/dashboard/stats', adminDashboardController.getDashboardStats);
router.get('/dashboard-stats', adminDashboardController.getAggregatedDashboardStats);
router.get('/cloudinary/test', adminDashboardController.testCloudinary);
router.get('/health', adminDashboardController.healthCheck);
router.get('/', adminDashboardController.getRootInfo);

module.exports = router;
