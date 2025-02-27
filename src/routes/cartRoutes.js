import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { addToCart, viewCart } from '../controllers/cartController.js';
import { cartValidator } from '../validators/cartValidator.js';

const router = Router();

router.post('/', authenticateUser, cartValidator, addToCart);
router.get('/', authenticateUser, viewCart);

export default router;
