import express from 'express';
const router = express.Router();
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
    uploadPreviewImage,
    payOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Create new order (multipart/form-data, up to 5 reference files)
router.route('/')
    .post(protect, upload.array('attachments', 5), createOrder)
    .get(protect, admin, getAllOrders);

router.route('/myorders')
    .get(protect, getUserOrders);

router.route('/:id')
    .put(protect, updateOrder)
    .delete(protect, admin, deleteOrder);

// Payment proof upload
router.route('/:id/pay')
    .post(protect, upload.single('paymentProof'), payOrder);

// Admin: upload preview screenshot
router.route('/:id/preview')
    .post(protect, admin, upload.single('previewImage'), uploadPreviewImage);

export default router;
