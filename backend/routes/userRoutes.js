import express from 'express';
const router = express.Router();
import {
    registerUser,
    authUser,
    getUserProfile,
    getAllUsers,
    deleteUser,
    updateUserRole,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/register', registerUser); // Alias as requested in Step 7
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);

export default router;
