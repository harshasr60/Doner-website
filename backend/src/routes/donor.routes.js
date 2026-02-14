const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

router.get('/wall', donorController.getDonorWall);

module.exports = router;
