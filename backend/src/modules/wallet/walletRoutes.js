const express = require('express');
const router = express.Router();
const walletController = require('./walletController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/balance', protect, walletController.getBalance);
router.get('/history', protect, walletController.getHistory);

module.exports = router;
