import express from 'express';
const router = express.Router();
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/')
    .get(getProjects)
    .post(protect, admin, upload.single('image'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, upload.single('image'), updateProject)
    .delete(protect, admin, deleteProject);

export default router;
