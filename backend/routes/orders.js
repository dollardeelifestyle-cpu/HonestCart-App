const express = require('express');
const auth = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getMyOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id', auth, updateOrderStatus);

module.exports = router;
