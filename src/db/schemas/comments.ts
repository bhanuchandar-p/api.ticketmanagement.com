import { integer, pgTable, serial, text, timestamp, AnyPgColumn, index } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const comments = pgTable('comments', {
    id: serial().primaryKey(),
    comment: text().notNull(),
    ticket_id: integer().references(() => tickets.id,{onDelete: 'cascade'}).notNull(),
    user_id: integer().references(() => users.id,{onDelete: 'cascade'}).notNull(),
    reply_to: integer().references(():AnyPgColumn=>comments.id),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp()
},(table)=>[
    index('comments_ticket_id_idx').on(table.ticket_id),
    index('comments_user_id_idx').on(table.user_id)
])

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type CommentsTable = typeof comments