import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { validationResult } from 'express-validator';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '../utils/responseHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { uploadOnCloudinary } from '../utils/uploadCloudinary.js';

// Create Product
export const createProduct = catchAsync(async (req, res) => {
  console.log('i am in create product api');

  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const { name, description, price, stock, categoryId } = req.body;

  const category = await Category.findByPk(categoryId);
  if (!category) return errorResponse(res, 'Category not found', 404);

  if (!req.file) return errorResponse(res, 'Image is required', 400);

  const imagePath = req.file.path;
  const cloudinaryResponse = await uploadOnCloudinary(imagePath);

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    categoryId,
    imageUrl: cloudinaryResponse.secure_url,
  });
  return successResponse(res, 'Product created successfully', product, 201);
});

// Get All Products
export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.findAll({ include: { model: Category, attributes: ['name'] } });
  return successResponse(res, 'Products retrieved successfully', products);
});

// Get Product by ID
export const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: Category });
  if (!product) return errorResponse(res, 'Product not found', 404);
  return successResponse(res, 'Product retrieved successfully', product);
});

// Update Product
export const updateProduct = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const product = await Product.findByPk(req.params.id);
  if (!product) return errorResponse(res, 'Product not found', 404);

  const updateData = req.body;

  if (req.file) {
    const imagePath = req.file.path;

    // Upload new image to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(imagePath);

    // Delete temp file after upload
    fs.unlinkSync(imagePath);

    // Delete old image from Cloudinary (optional)
    if (product.imageUrl) {
      const publicId = product.imageUrl.split('/').pop().split('.')[0]; // Extract publicId
      await deleteFromCloudinary(publicId);
    }

    updateData.imageUrl = cloudinaryResponse.secure_url;
  }

  await product.update(updateData);
  return successResponse(res, 'Product updated successfully', product);
});

// Delete Product
export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return errorResponse(res, 'Product not found', 404);

  await product.destroy();
  return successResponse(res, 'Product deleted successfully');
});
