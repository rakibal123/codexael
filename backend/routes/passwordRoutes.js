import express from 'express';
const router = express.Router();
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
