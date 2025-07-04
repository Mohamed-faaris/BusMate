import { index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createTable } from "./table";

// ACCOUNTS
export const accounts = createTable("account", (d) => ({
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id),
  password: d.varchar({ length: 255 }).notNull(),
}));

// export const accountsUserIdIdx = index("accounts_user_id_idx").on(
//   accounts.userId,
// );
