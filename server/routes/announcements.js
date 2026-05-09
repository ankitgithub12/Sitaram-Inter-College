const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcementsController');

router.get('/', announcementsController.getAnnouncements);
router.post('/', announcementsController.uploadAttachments.array('attachments', 5), announcementsController.createAnnouncement);
router.put('/:id', announcementsController.uploadAttachments.array('attachments', 5), announcementsController.updateAnnouncement);
router.delete('/:id', announcementsController.deleteAnnouncement);

module.exports = router;
