const Institution = require('../../models/Institution');
const User = require('../../models/User');

// @desc    Register a new institution
// @route   POST /api/institutions
exports.registerInstitution = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingInstitution = await Institution.findOne({ owner: req.user._id });
    if (existingInstitution) {
      return res.status(400).json({ message: 'You already have an institution registered.' });
    }

    const institution = await Institution.create({
      name,
      description,
      owner: req.user._id,
      status: 'Pending'
    });
    
    // Update user's institutionId
    await User.findByIdAndUpdate(req.user._id, { institutionId: institution._id });

    res.status(201).json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get my institution
// @route   GET /api/institutions/my
exports.getMyInstitution = async (req, res) => {
  try {
    const institution = await Institution.findOne({ owner: req.user._id });
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    res.json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve institution (PlatformAdmin only)
// @route   PATCH /api/institutions/:id/approve
exports.approveInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reject institution (PlatformAdmin only)
// @route   PATCH /api/institutions/:id/reject
exports.rejectInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all approved institutions
// @route   GET /api/institutions
exports.getApprovedInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ status: 'Approved' });
    res.json(institutions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all institutions (PlatformAdmin only)
// @route   GET /api/institutions/all
exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({});
    res.json(institutions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
