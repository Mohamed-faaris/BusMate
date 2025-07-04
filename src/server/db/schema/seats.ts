import { sql } from "drizzle-orm";
import { seatStatusEnum } from "./enums";
import { createTable } from "./table";
import { buses } from "./buses";
import { users } from "./users";

// SEATS
export const seats = createTable("seat", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d.varchar({ length: 255 }).notNull().references(()=>users.id),
  busId: d.varchar({ length: 255 }).notNull().references(() => buses.id),
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
