import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";
import { seatStatusEnum } from "./enums";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

// SEATS
export const seats = createTable("seat", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d.varchar({ length: 255 }).notNull(),
  busId: d.varchar({ length: 255 }).notNull(),
  status: seatStatusEnum("status").default("available"),

  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
}));
