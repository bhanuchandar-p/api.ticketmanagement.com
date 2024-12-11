import { Hono } from 'hono';
import UserController from '../controllers/userController';

const userRouter = new Hono();
const userController = new UserController();

userRouter.post('/add-developer',userController.createDeveloperUser);
userRouter.post('/add-user',userController.createUser);
userRouter.get('/',userController.getUsersPaginated);
userRouter.get('/:id',userController.getUserbyId);
userRouter.patch('/',userController.updateUser);
userRouter.delete('/:id',userController.softdeleteUser);
userRouter.patch('/password',userController.updatePassword);

export default userRouter;