import Category from '../models/Category.js';
import { validationResult } from 'express-validator';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '../utils/responseHandler.js';
import { catchAsync } from '../utils/catchAsync.js';

// Create Category
export const createCategory = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const { name, description } = req.body;
  const existingCategory = await Category.findOne({ where: { name } });

  if (existingCategory) return errorResponse(res, 'Category already exists', 400);

  const category = await Category.create({ name, description });
  return successResponse(res, 'Category created successfully', category, 201);
});

// Get All Categories
export const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.findAll();
  return successResponse(res, 'Categories fetched successfully', categories);
});

// Get Single Category
export const getCategoryById = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const category = await Category.findByPk(req.params.id);
  if (!category) return errorResponse(res, 'Category not found', 404);

  return successResponse(res, 'Category fetched successfully', category);
});

// Update Category
export const updateCategory = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const category = await Category.findByPk(req.params.id);
  if (!category) return errorResponse(res, 'Category not found', 404);

  await category.update(req.body);
  return successResponse(res, 'Category updated successfully', category);
});

// Delete Category
export const deleteCategory = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrorResponse(res, errors);

  const category = await Category.findByPk(req.params.id);
  if (!category) return errorResponse(res, 'Category not found', 404);

  await category.destroy();
  return successResponse(res, 'Category deleted successfully');
});
