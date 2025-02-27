import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const updateCategoryValidator = [
  param("id").isUUID().withMessage("Invalid category ID"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const getCategoryValidator = [
  param("id").isUUID().withMessage("Invalid category ID"),
];

export const deleteCategoryValidator = [
  param("id").isUUID().withMessage("Invalid category ID"),
];
