const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/', protect, orderController.placeOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/institution/:id', protect, authorize('InstitutionAdmin', 'PlatformAdmin'), orderController.getInstitutionOrders);
router.put('/:id/status', protect, authorize('InstitutionAdmin'), orderController.updateOrderStatus);

module.exports = router;
