import { validationResult } from 'express-validator';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '../utils/responseHandler.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import { sequelize } from '../config/db.js';
import { catchAsync } from '../utils/catchAsync.js';

export const placeOrder = catchAsync(async (req, res) => {
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const userId = req.user.id;
  const { items } = req.body;
  console.log(items);

  const transaction = await sequelize.transaction();

  let totalAmount = 0;
  const order = await Order.create({ userId, totalAmount: 0 }, { transaction });

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      await transaction.rollback();
      return errorResponse(res, 'Product not found', 404);
    }

    if (product.stock < item.quantity) {
      await transaction.rollback();
      return errorResponse(res, `Insufficient stock`, 400);
    }

    totalAmount += product.price * item.quantity;

    await OrderItem.create(
      {
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        priceAtOrder: product.price,
      },
      { transaction },
    );

    product.stock -= item.quantity;
    await product.save({ transaction });
  }

  order.totalAmount = totalAmount;
  await order.save({ transaction });

  await transaction.commit();
  return successResponse(res, 'Order placed successfully', {} , 201);
});

export const getOrderHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
    
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        include: [{ model: Product, attributes: ['name', 'imageUrl'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  
  return successResponse(res, 'Order history retrieved', orders, 200);
});
