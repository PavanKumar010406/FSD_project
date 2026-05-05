const Order = require('../../models/Order');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const crypto = require('crypto');

// @desc    Place an order
// @route   POST /api/order
exports.placeOrder = async (req, res) => {
  const { institutionId, items, totalAmount, orderType } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user.wallet.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct coins from wallet
    user.wallet.balance -= totalAmount;
    user.wallet.lastUpdated = Date.now();
    await user.save();

    // Create a transaction record
    await Transaction.create({
      userId: user._id,
      amount: totalAmount,
      type: 'Debit',
      description: `Order at institution ${institutionId}`
    });

    // Generate QR code for order
    const qrCode = crypto.randomBytes(16).toString('hex');

    const order = await Order.create({
      userId: user._id,
      institutionId,
      items,
      totalAmount,
      qrCode,
      orderType: orderType || 'Instant'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/order/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/order/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('institutionId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get institution orders (InstitutionAdmin only)
// @route   GET /api/order/institution/:id
exports.getInstitutionOrders = async (req, res) => {
  try {
    const orders = await Order.find({ institutionId: req.params.id }).populate('userId', 'name email mobile');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
