import { index, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";
export const ticketAssignes = pgTable('ticket_assignes', {
    id: serial().primaryKey(),
    ticket_id: integer().references(() => tickets.id).notNull(),
    user_id: integer().references(() => users.id).notNull(),
    assigned_at: timestamp().defaultNow(),
    updated_at: timestamp()
})

export type TicketAssignes = typeof ticketAssignes.$inferSelect
export type NewTicketAssignes = typeof ticketAssignes.$inferInsert
export type TicketAssignesTable = typeof ticketAssignes