import { pgEnum,integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users"
import { SQL, sql } from "drizzle-orm";


export const Priorities = pgEnum('priority', ['low', 'medium', 'high'])
export const TicketStatus = pgEnum('status', ['open', 'closed', 'inprogress'])
export const tickets = pgTable('tickets', {
    id: serial().primaryKey(),
    title: varchar().notNull(),
    description: text(),
    status: TicketStatus().default('open'),
    priority: Priorities().notNull(),
    requested_by: integer().references(() => users.id).notNull(),
    assigned_to: integer().references(()=> users.id),
    assigned_at: timestamp(),
    due_date: timestamp(),
    ticket_code: text().generatedAlwaysAs(():SQL => sql`('TKT-' || ${tickets.id})`),                    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
})

export type Ticket = typeof tickets.$inferSelect
export type NewTicket = typeof tickets.$inferInsert                    
export type TicketsTables = typeof tickets