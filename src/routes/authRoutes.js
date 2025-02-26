import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { signinValidator, signupValidator } from "../validators/authValidators.js";

const router = Router();

router.post('/sign-up',signupValidator, signUp);
router.post('/sign-in',signinValidator, signIn);

export default router;