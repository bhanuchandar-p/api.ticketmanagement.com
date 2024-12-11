// import { index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
// import { users } from "./users";

// export const refreshTokens = pgTable('refresh_tokens', {
//     id: serial().primaryKey(),
//     user_id: integer().notNull().references(() => users.id),
//     token: varchar().notNull(),
//     created_at: timestamp().defaultNow().notNull(),
//     updated_at: timestamp().defaultNow()
// }, (table) => [
//     index('refresh_tokens_user_id_idx').on(table.user_id)   
// ])


// export type RefreshToken = typeof refreshTokens.$inferSelect;
// export type NewRefreshToken = typeof refreshTokens.$inferInsert;
// export type RefreshTokenTable = typeof refreshTokens;
