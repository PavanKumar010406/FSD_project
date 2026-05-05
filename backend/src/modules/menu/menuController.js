const Menu = require('../../models/Menu');
const Institution = require('../../models/Institution');

// @desc    Add a food item to menu
// @route   POST /api/menu
exports.addMenuItem = async (req, res) => {
  const { name, price, category } = req.body;

  try {
    const institution = await Institution.findOne({ owner: req.user._id });

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found.' });
    }

    if (institution.status !== 'Approved') {
      return res.status(403).json({ message: 'Your institution is not approved yet' });
    }

    const menuItem = await Menu.create({
      name,
      price,
      category,
      institutionId: institution._id
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get menu by institution ID
// @route   GET /api/menu/:institutionId
exports.getMenuByInstitution = async (req, res) => {
  try {
    const menuItems = await Menu.find({ institutionId: req.params.institutionId });
    res.json(menuItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
