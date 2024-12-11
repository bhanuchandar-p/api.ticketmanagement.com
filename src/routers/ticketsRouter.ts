import { Hono } from "hono";
import TicketsController from "../controllers/ticketsController";

const ticketsRouter = new Hono();
const ticketController = new TicketsController();

// ticketsRouter.get("/", TicketsController.filterAllTickets);
ticketsRouter.get("/:id", ticketController.getTicketById); 
ticketsRouter.post("/", ticketController.addTicket);
ticketsRouter.put("/:id", ticketController.deleteTicket);
// ticketsRouter.delete("/:id", TicketsController.deleteTicket);

export default ticketsRouter;