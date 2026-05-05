const express = require('express');
const router = express.Router();
const institutionController = require('./institutionController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/', protect, authorize('InstitutionAdmin'), institutionController.registerInstitution);
router.get('/my', protect, authorize('InstitutionAdmin'), institutionController.getMyInstitution);
router.patch('/:id/approve', protect, authorize('PlatformAdmin'), institutionController.approveInstitution);
router.patch('/:id/reject', protect, authorize('PlatformAdmin'), institutionController.rejectInstitution);

// Keep some previous routes if needed, or update them:
router.get('/', institutionController.getApprovedInstitutions);
router.get('/all', protect, authorize('PlatformAdmin'), institutionController.getAllInstitutions);

module.exports = router;
