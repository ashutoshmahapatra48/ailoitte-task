import { validationResult } from 'express-validator';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '../utils/responseHandler.js';

export const addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const product = await Product.findByPk(productId);
  if (!product) return errorResponse(res, 'Product not found', 404);

  let cartItem = await Cart.findOne({ where: { userId, productId } });

  if (cartItem) {
    if (quantity <= 0) {
      await cartItem.destroy();
    }
    cartItem.quantity = quantity;
    await cartItem.save();
  } else {
    cartItem = await Cart.create({ userId, productId, quantity, priceAtAdd: product.price });
  }

  return successResponse(res, 'Cart updated', 200);
};

export const viewCart = async (req, res) => {
  const userId = req.user.id;

  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Product, attributes: ['name', 'price', 'imageUrl'] }],
  });
  return successResponse(res, 'Cart retrieved', cartItems, 200);
};
