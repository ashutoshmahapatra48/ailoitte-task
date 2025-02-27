import { body, param } from "express-validator";

export const createProductValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").optional().isString(),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("categoryId").isUUID().withMessage("Invalid category ID"),
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }
    return true;
  }),
];

export const updateProductValidator = [
  param("id").isUUID().withMessage("Invalid product ID"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().isString(),
  body("price").optional().isFloat({ gt: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("categoryId").optional().isUUID(),
  body("image").custom((value, { req }) => {
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      throw new Error("Invalid image file");
    }
    return true;
  }),
];

export const getProductValidator = [
  param("id").isUUID().withMessage("Invalid product ID"),
];

export const deleteProductValidator = [
  param("id").isUUID().withMessage("Invalid product ID"),
];
