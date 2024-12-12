import { Hono } from "hono";
import AuthController from "../controllers/authController";

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/signup',authController.signup);
authRouter.post('/login',authController.login);
authRouter.post('/forgot-password',authController.forgotPassword);
authRouter.post('/reset-password',authController.resetPassword);
authRouter.post('/refresh-token',authController.generateTokenfromRefreshToken);


export default authRouter;