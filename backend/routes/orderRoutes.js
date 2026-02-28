const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    uploadPreviewImage,
    payOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create new order (multipart/form-data, up to 5 reference files)
router.route('/')
    .post(protect, upload.array('attachments', 5), createOrder)
    .get(protect, admin, getAllOrders);

router.route('/myorders')
    .get(protect, getUserOrders);

router.route('/:id')
    .put(protect, admin, updateOrderStatus)
    .delete(protect, admin, deleteOrder);

// Payment proof upload
router.route('/:id/pay')
    .post(protect, upload.single('paymentProof'), payOrder);

// Admin: upload preview screenshot
router.route('/:id/preview')
    .post(protect, admin, upload.single('previewImage'), uploadPreviewImage);

module.exports = router;
