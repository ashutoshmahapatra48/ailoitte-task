import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHandler.js";

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return errorResponse(res, "Unauthorized request", 401);
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid token", 401);
  }
};
