import { Hono } from 'hono';
import ProjectController from '../controllers/projectController';
import { isAuthorized } from '../middlewares/isAuthorized';

const projectRouter = new Hono();
const projectController = new ProjectController()

projectRouter.post('/',isAuthorized,projectController.addProject);
projectRouter.patch('/:id',isAuthorized,projectController.updateProject);
projectRouter.get('/',isAuthorized,projectController.getAllProjects);
projectRouter.get('/:id/members',isAuthorized,projectController.getProjectusers);
projectRouter.post('/:id/members',isAuthorized,projectController.addProjectUsers);
projectRouter.get('/:id',isAuthorized,projectController.getProjectbyId);
projectRouter.delete('/:id',isAuthorized,projectController.deleteProject);

projectRouter.get('/:id/tickets',isAuthorized,projectController.getProjectbasedTickets);

export default projectRouter;

