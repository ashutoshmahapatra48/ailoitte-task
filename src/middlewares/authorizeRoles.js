import { errorResponse } from "../utils/responseHandler.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, "Access denied: Insufficient permissions", 403);
    }
    next();
  };
};
