const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Authorization header missing' });
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token || (!token.startsWith('token_admin_') && token !== 'adminToken123')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
  next();
};

router.get('/', authenticateAdmin, contactController.getContacts);
router.get('/:id', authenticateAdmin, contactController.getContactById);
router.put('/:id/status', authenticateAdmin, contactController.updateContactStatus);
router.delete('/:id', authenticateAdmin, contactController.deleteContact);
router.post('/', contactController.createContact);

module.exports = router;