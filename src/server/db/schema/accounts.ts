import { index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createTable } from "./table";

// ACCOUNTS
export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .uuid()
      .notNull()
      .primaryKey()
      .references(() => users.id),
    password: d.varchar({ length: 255 }).notNull(),
  }),
  (table) => [index("userId_idx").on(table.userId)],
);
