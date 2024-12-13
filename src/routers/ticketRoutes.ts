import { Hono } from "hono";
import TicketsController from "../controllers/ticketController";

const ticketsRouter = new Hono();
const ticketController = new TicketsController();

// ticketsRouter.get("/", TicketsController.filterAllTickets);
ticketsRouter.get("/:id", ticketController.getTicketById); 
ticketsRouter.post("/", ticketController.addTicket);
ticketsRouter.put("/:id", ticketController.updateTicket);
ticketsRouter.delete("/:id", ticketController.deleteTicket);
ticketsRouter.patch("/:id/assign", ticketController.assignTicket);
ticketsRouter.get("/",ticketController.getAllTickets);


// comments Routes
ticketsRouter.get("/:id/comments", ticketController.getComments); 
ticketsRouter.post("/:id/comments", ticketController.addComment); 
ticketsRouter.delete("/:id/comments/:commentId", ticketController.deleteComment);


//attachments Routes
ticketsRouter.post("/:id/attachments/upload", ticketController.getUploadURL); 
ticketsRouter.post("/:id/attachments/download", ticketController.getDownloadURL);
// ticketsRouter.delete("/:id/attachments/:attachmentId", ticketController.deleteAttachment);

export default ticketsRouter;