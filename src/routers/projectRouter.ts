import { Hono } from 'hono';
import ProjectController from '../controllers/projectController';
import { isAuthorized } from '../middlewares/isAuthorized';

const projectRouter = new Hono();
const projectController = new ProjectController()

projectRouter.post('/',isAuthorized,projectController.addProject);
projectRouter.patch('/:id',projectController.updateProject);
projectRouter.get('/',projectController.getAllProjects);
projectRouter.get('/:id/members',projectController.getProjectusers);
projectRouter.post('/:id/members',projectController.addProjectUsers);
projectRouter.get('/:id',projectController.getProjectbyId);
projectRouter.delete('/:id',projectController.deleteProject);

projectRouter.get('/:id/tickets',projectController.getProjectbasedTickets);

export default projectRouter;

