export const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const validationErrorResponse = (res, errors, statusCode = 400) => {
  
  return res.status(statusCode).json({
    success: false,
    message: 'Validation errors',
    errors: errors.array().map((err) => ({
      
      field: err.path,
      message: err.msg,
    })),
  });
};
