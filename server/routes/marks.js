const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

router.get('/', marksController.getMarks);
router.get('/student/:studentId', marksController.getStudentMarks);
router.post('/', marksController.createMarks);
router.put('/:id', marksController.updateMarks);
router.delete('/:id', marksController.deleteMarks);

module.exports = router;
