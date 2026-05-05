const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['PlatformAdmin', 'InstitutionAdmin', 'User'], 
    default: 'User' 
  },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
  wallet: {
    balance: { type: Number, default: 50 },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
