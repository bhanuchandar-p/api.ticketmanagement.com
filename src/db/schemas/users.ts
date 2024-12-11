
import { index, pgTable, serial, text, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

export const UserType = pgEnum('user_type',['admin','user','developer'])

export const users = pgTable('users', {
    id: serial().primaryKey(),
    first_name: varchar().notNull(),
    last_name: varchar().notNull(),
    middle_name: varchar(),
    email: varchar().notNull(),
    password: varchar().notNull(),
    phone_number: varchar(),
    user_type: UserType().default('user'),
    is_active: text().default('true'),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow()
},(table) => [
    index('users_email_idx').on(table.email),
    index('users_id').on(table.id)
]
)


export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserTable = typeof users