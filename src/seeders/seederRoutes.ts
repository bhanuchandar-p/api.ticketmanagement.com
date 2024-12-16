import { Hono } from "hono";
import { seedAttachments, seedComments, seedProjectMembers, seedTicketAssignees, seedTickets, seedUsers } from "./seeder";

const seeder = new Hono();

seeder.get('/users',seedUsers);
seeder.get('/tickets',seedTickets);
seeder.get('/project-members',seedProjectMembers);
seeder.get('/ticket-assignees',seedTicketAssignees);
seeder.get('/comments',seedComments)
seeder.get('/attachments',seedAttachments)

export default seeder