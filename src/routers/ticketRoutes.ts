import { Hono } from "hono";
import TicketsController from "../controllers/ticketController";
import { isAuthorized } from "../middlewares/isAuthorized";

const ticketsRouter = new Hono();
const ticketController = new TicketsController();

//tickets Routes
ticketsRouter.get("/:id",isAuthorized,ticketController.getTicketById); 
ticketsRouter.post("/", isAuthorized,ticketController.addTicket);
ticketsRouter.put("/:id", isAuthorized,ticketController.updateTicket);
ticketsRouter.delete("/:id", isAuthorized,ticketController.deleteTicket);
ticketsRouter.patch("/:id/assign/:agentId",isAuthorized, ticketController.assignTicket);
ticketsRouter.get('/',isAuthorized,ticketController.getPaginatedTickets);


// comments Routes
ticketsRouter.get("/:id/comments", isAuthorized,ticketController.getComments); 
ticketsRouter.post("/:id/comments", isAuthorized, ticketController.addComment); 
ticketsRouter.delete("/:id/comments/:commentId",isAuthorized, ticketController.deleteComment);


//attachments Routes
ticketsRouter.post("/:id/attachments/upload", isAuthorized,ticketController.getUploadURL); 
ticketsRouter.post("/:id/attachments/download", isAuthorized,ticketController.getDownloadURL);
ticketsRouter.delete("/:id/attachments/:attachmentId", ticketController.deleteTicketAttachmentById);
ticketsRouter.post("/:id/attachments", isAuthorized,ticketController.addAttachmentToTicket);
ticketsRouter.get("/:id/attachments", isAuthorized,ticketController.getAttachmentsByTicketId);


export default ticketsRouter;