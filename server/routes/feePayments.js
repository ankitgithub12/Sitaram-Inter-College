const express = require('express');
const router = express.Router();
const feePaymentController = require('../controllers/feePaymentController');

// Middleware to check admin authentication
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Authorization header missing' });
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token || (!token.startsWith('token_admin_') && token !== 'adminToken123')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
  next();
};

// Routes
router.post(
  '/', 
  feePaymentController.handleFormData, 
  feePaymentController.upload.single('receiptFile'), 
  feePaymentController.createFeePayment
);

// Alias for the /upload endpoint used by the frontend
router.post(
  '/upload', 
  feePaymentController.handleFormData, 
  feePaymentController.upload.single('receiptFile'), 
  feePaymentController.createFeePayment
);

router.get('/', authenticateAdmin, feePaymentController.getFeePayments);
router.get('/stats/summary', authenticateAdmin, feePaymentController.getFeePaymentStats);
router.get('/search/advanced', authenticateAdmin, feePaymentController.searchFeePaymentsAdvanced);
router.get('/receipt/:receiptNumber', feePaymentController.getFeePaymentByReceipt);
router.get('/email/:email', feePaymentController.getFeePaymentsByEmail);
router.get('/:id', authenticateAdmin, feePaymentController.getFeePaymentById);
router.put('/:id/status', authenticateAdmin, feePaymentController.updateFeePaymentStatus);
router.put('/:id', authenticateAdmin, feePaymentController.updateFeePayment);
router.delete('/:id', authenticateAdmin, feePaymentController.deleteFeePayment);
router.post(
  '/:id/receipt', 
  authenticateAdmin, 
  feePaymentController.upload.single('receiptFile'), 
  feePaymentController.uploadReceiptForPayment
);

module.exports = router;