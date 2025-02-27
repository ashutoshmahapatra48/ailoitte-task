import { Router } from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from '../controllers/productController.js';

import { createProductValidator, updateProductValidator } from '../validators/productValidator.js';

import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles('admin'),
  upload.single('image'),
  createProductValidator,
  createProduct,
);

router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  upload.single('image'),
  updateProductValidator,
  updateProduct,
);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteProduct);

export default router;
