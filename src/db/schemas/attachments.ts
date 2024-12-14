import { json, pgTable, serial, timestamp, varchar,integer, index } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";

type Metadata = {
    file_size: number;
    file_name: string;
    file_type: string;
};

export const attachments = pgTable('attachments', {
    id: serial().primaryKey(),  
    file_key: varchar().notNull(),
    ticket_id: integer().references(() => tickets.id,{onDelete: 'cascade'}).notNull(),
    meta_data: json().$type<Metadata>(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp()
},
(table) => [
    index('attachments_ticket_id_idx').on(table.ticket_id)
])

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
export type AttachmentsTable = typeof attachments