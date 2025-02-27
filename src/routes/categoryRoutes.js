import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from '../validators/categoryValidator.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles('admin'),
  createCategoryValidator,
  createCategory,
);
router.get('/', getAllCategories);
router.get('/:id', getCategoryValidator, getCategoryById);
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  updateCategoryValidator,
  updateCategory,
);
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  deleteCategoryValidator,
  deleteCategory,
);

export default router;
