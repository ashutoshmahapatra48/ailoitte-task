import { body } from 'express-validator';

export const cartValidator = [
  body('productId').isUUID().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
];
