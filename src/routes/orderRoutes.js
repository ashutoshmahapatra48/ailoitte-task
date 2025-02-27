import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { placeOrderValidator } from '../validators/orderValidator.js';
import { getOrderHistory, placeOrder } from '../controllers/orderController.js';

const router = Router();

router.post('/', authenticateUser, placeOrderValidator, placeOrder);
router.get('/history', authenticateUser, getOrderHistory);

export default router;
