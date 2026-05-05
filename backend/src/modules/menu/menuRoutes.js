const express = require('express');
const router = express.Router();
const menuController = require('./menuController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/', protect, authorize('InstitutionAdmin'), menuController.addMenuItem);
router.get('/:institutionId', menuController.getMenuByInstitution);

module.exports = router;
