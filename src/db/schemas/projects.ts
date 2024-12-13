import { index, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const projects = pgTable('projects', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    description: text(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
    project_code: text().notNull(),
    created_by: integer().references(() => users.id),
    status: text().default('active')
},(table) => [
    index('projects_name_idx').on(table.name),
    index('project_code_idx').on(table.project_code)
]
)
export type project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectTable = typeof projects