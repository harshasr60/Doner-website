const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/donation/:donationId', reportController.getReportsByDonation);
router.post('/create', reportController.createReport);

module.exports = router;
