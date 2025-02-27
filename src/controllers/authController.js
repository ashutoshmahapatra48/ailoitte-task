import { validationResult } from 'express-validator';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '../utils/responseHandler.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { catchAsync } from '../utils/catchAsync.js';
import { generateToken } from '../utils/jwtHelper.js';


// SIGNUP
export const signUp = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationErrorResponse(res, errors);
  }

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return errorResponse(res, 'User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user);
  return successResponse(res, 'User registered successfully', { token }, 201);
});

// SIGNIN
export const signIn = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationErrorResponse(res, errors);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user);
  return successResponse(res, 'Login successful', { token });
});
