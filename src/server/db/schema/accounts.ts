import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

// ACCOUNTS
export const accounts = createTable("account", (d) => ({
  userId: d.varchar({ length: 255 }).notNull().primaryKey(),
  password: d.varchar({ length: 255 }).notNull(),
}));

export const accountsUserIdIdx = index("accounts_user_id_idx").on(
  accounts.userId,
);
