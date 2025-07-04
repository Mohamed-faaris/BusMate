import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { seatStatusEnum } from "./enums";
import { createTable } from "./table";
import { buses } from "./buses";
import { users } from "./users";

// SEATS
export const seats = createTable(
  "seat",
  (d) => ({
    id: d.serial().primaryKey().notNull(),
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    busId: d
      .uuid()
      .notNull()
      .references(() => buses.id),
    status: seatStatusEnum("status").default("available"),

    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
  }),
  (table) => [
    index("seatTbUserId_idx").on(table.userId),
    index("seatTbbusId_idx").on(table.busId),
  ],
);
