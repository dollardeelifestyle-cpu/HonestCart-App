const express = require('express');
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  becomeSeller,
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/become-seller', auth, becomeSeller);

module.exports = router;
