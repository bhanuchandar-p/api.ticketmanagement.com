import { Hono } from "hono";
import UserController from "../controllers/userController";

const onboardRouter = new Hono();
const userController = new UserController();

onboardRouter.post('/create-admin',userController.createadminUser);

export default onboardRouter;

