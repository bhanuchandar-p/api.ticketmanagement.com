import { json, pgTable, serial, timestamp, varchar,integer } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";

type Metadata = {
    file_size: number;
    file_name: string;
    file_type: string;
};

export const attachments = pgTable('attachments', {
    id: serial().primaryKey(),  
    file_path: varchar().notNull(),
    ticket_id: integer().references(() => tickets.id,{onDelete: 'cascade'}).notNull(),
    meta_data: json().$type<Metadata>(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp()
})

export type SelectAttachment = typeof attachments.$inferSelect;
export type InsertAttachment = typeof attachments.$inferInsert;