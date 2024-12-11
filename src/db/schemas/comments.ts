import { integer, pgTable, serial, text, timestamp, AnyPgColumn } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const comments = pgTable('comments', {
    id: serial().primaryKey(),
    comment: text().notNull(),
    ticket_id: integer().references(() => tickets.id,{onDelete: 'cascade'}).notNull(),
    reply_to: integer().references(():AnyPgColumn=>comments.id),
    user_id: integer().references(() => users.id,{onDelete: 'cascade'}).notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp()
})

export type SelectComment = typeof comments.$inferSelect
export type InsertComment = typeof comments.$inferInsert