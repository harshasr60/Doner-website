const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);

module.exports = router;
