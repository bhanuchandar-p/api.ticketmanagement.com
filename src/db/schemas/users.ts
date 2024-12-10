
import { index, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial().primaryKey(),
    first_name: varchar().notNull(),
    last_name: varchar(),
    email: varchar().notNull(),
    password: varchar().notNull(),
    phone_number: varchar(),
    user_type: text().default('user'),
    is_active: text().default('true'),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow()
},(table) => [
    index('users_email_idx').on(table.email)
]
)


export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserTable = typeof users