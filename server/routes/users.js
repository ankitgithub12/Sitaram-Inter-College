const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadFaculty } = require('../middleware/uploadMiddleware');

router.get('/manage', userController.getUsers);
router.get('/faculty', userController.getFaculty);
router.post('/upload-photo', uploadFaculty.single('photo'), (req, res) => {
  if (req.file) {
    res.json({ success: true, url: req.file.path });
  } else {
    res.status(400).json({ success: false, message: 'Upload failed' });
  }
});
router.post('/create', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.patch('/:id/toggle-status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
