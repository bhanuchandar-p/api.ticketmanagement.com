import { Hono } from 'hono';
import UserController from '../controllers/userController';
import { isAuthorized } from '../middlewares/isAuthorized';
import { canCreateDeveloperUser, canCreateRegularUser, canViewAllUsers } from '../middlewares/guards/guardUser';

const userRouter = new Hono();
const userController = new UserController();

userRouter.post('/add-developer',canCreateDeveloperUser,userController.createDeveloperUser);
userRouter.post('/add-user',canCreateRegularUser,userController.createUser);
userRouter.get('/',canViewAllUsers,userController.getUsersPaginated);
userRouter.get('/:id',isAuthorized,userController.getUserbyId);
userRouter.patch('/',isAuthorized,userController.updateUser);
userRouter.delete('/:id',isAuthorized,userController.softdeleteUser);
userRouter.patch('/password',isAuthorized,userController.updatePassword);

export default userRouter;