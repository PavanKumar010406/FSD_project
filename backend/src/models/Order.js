const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed'], 
    default: 'Placed' 
  },
  qrCode: { type: String },
  orderType: { 
    type: String, 
    enum: ['Instant', 'Pre-order'], 
    default: 'Instant' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
