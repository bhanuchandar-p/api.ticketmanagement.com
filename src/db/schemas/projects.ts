import { SQL, sql } from "drizzle-orm";
import { index, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const projects = pgTable('projects', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    description: text(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
    project_code: text().generatedAlwaysAs(():SQL => sql`('PRJ-' || ${projects.id})`),
    created_by: integer().references(() => users.id)
},(table) => [
    index('projects_name_idx').on(table.name)
]
)
export type project = typeof projects.$inferSelect
export type NewInsert = typeof projects.$inferInsert
export type ProjectTable = typeof projects
