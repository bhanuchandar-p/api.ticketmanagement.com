// import { boolean, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
// import { users } from "./users";

// export const resetPasswordTokens = pgTable('reset_password_tokens', {
//     id: serial().primaryKey(),
//     user_id: integer().notNull().references(() => users.id),
//     token: varchar().notNull(),
//     is_verified:boolean().default(false),
//     created_at: timestamp().defaultNow().notNull(),
//     updated_at: timestamp().defaultNow(),
// }, (table) => [
//     index('reset_password_tokens_user_id_idx').on(table.token)
// ]
// );

// export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
// export type NewResetPasswordToken = typeof resetPasswordTokens.$inferInsert;

