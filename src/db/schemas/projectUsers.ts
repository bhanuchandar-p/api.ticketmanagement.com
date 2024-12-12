import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const projectUsers = pgTable('project_users', {
    id: serial().primaryKey(),
    project_id: integer().references(() => projects.id),
    user_id: integer().references(() => users.id),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp(),
},(table) => [
    index('project_users_user_id_idx').on(table.user_id),
    index('project_users_project_id_idx').on(table.project_id)
])

export type ProjectUser = typeof projectUsers.$inferSelect;
export type NewProjectuser = typeof projectUsers.$inferInsert;
export type ProjectUserTable = typeof projectUsers; 