const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ balance: user.wallet.balance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/history
exports.getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
