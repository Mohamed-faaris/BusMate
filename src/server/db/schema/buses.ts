import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";
import type { Seat } from "./models";

// BUSES
export const buses = createTable(
  "bus",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    modelId: d.uuid().notNull(),
    busNumber: d.varchar({ length: 10 }).notNull().unique(),
    routeName: d.varchar({ length: 255 }),
    driverName: d.varchar({ length: 255 }).notNull(),
    driverPhone: d.varchar({ length: 15 }).notNull(),
    seats: d
      .json("seats")
      .$type<Record<string, Seat["seatStatus"]>>()
      .notNull(),
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
    index("busNumber_idx").on(table.busNumber),
    index("routeName_idx").on(table.routeName),
  ],
);
