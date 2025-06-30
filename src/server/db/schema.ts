import { is, relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { receiveMessageOnPort } from "worker_threads";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `BusMate_${name}`);



export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  
  rollNo: d.varchar({ length: 10 }).notNull().unique(),
  name: d.varchar({ length: 255 }),
  gender: d.varchar({ length: 255 }).notNull(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  phone: d
    .varchar({ length: 15 })
    .notNull(),
  address: d.varchar({ length: 255 }).notNull(),
  dateOfBirth: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  
  busId: d.varchar({ length: 255 }).notNull(),
  seatId: d.varchar({ length: 255 }).notNull(),
  receiptId: d.varchar({ length: 255 }).notNull(),
  isVerified: d.boolean().notNull().default(false),

  isAdmin: d.boolean().notNull().default(false),

  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    password: d.varchar({ length: 255 }).notNull(),
    }),
  (t) => [
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const acceptedRolls = createTable(
  "acceptedRolls",
  (d) => ({
      rollNo: d.varchar({ length: 10 }).notNull().unique(),
      boardingPoint: d.varchar({ length: 255 }).notNull(),
  })
)