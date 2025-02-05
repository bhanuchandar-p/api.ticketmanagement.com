import { pgEnum,integer, pgTable, serial, text, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { users } from "./users"
import { SQL, sql } from "drizzle-orm";
import { projects } from "./projects";


export const Priorities = pgEnum('priority', ['low', 'medium', 'high'])
export const TicketStatus = pgEnum('status', ['open', 'closed', 'inprogress'])
export const tickets = pgTable('tickets', {
    id: serial().primaryKey(),
    title: varchar().notNull(),
    description: text(),
    project_id: integer().references(() => projects.id).notNull(),
    status: TicketStatus().default('open'),
    priority: Priorities().notNull(),
    requested_by: integer().references(() => users.id).notNull(), 
    due_date: timestamp(),
    ticket_code: text().generatedAlwaysAs(():SQL => sql`('TKT-' || ${tickets.id})`),                    
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
},(table) => [
    index('tickets_id_idx').on(table.id),
    index('ticket_title_idx').on(table.title),
    index('ticket_status_idx').on(table.status),
    index('ticket_priority_idx').on(table.priority)
])

export type Ticket = typeof tickets.$inferSelect
export type NewTicket = typeof tickets.$inferInsert                    
export type TicketsTable = typeof tickets
