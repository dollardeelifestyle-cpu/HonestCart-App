const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (address) user.address = { ...user.address, ...address };

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const becomeSeller = async (req, res) => {
  try {
    const { storeName, description, logo } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isSeller = true;
    user.role = 'seller';
    user.sellerInfo = {
      storeName: storeName || 'My Store',
      description: description || '',
      logo: logo || '',
      rating: 0,
    };

    await user.save();
    res.json({ message: 'You are now a seller', user });
  } catch (error) {
    res.status(500).json({ message: 'Error becoming seller', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  becomeSeller,
};
