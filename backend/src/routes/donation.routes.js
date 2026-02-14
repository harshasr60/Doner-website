const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/create', donationController.createDonationOrder);
router.post('/verify', donationController.verifyPayment);

module.exports = router;
