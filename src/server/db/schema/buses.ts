import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";

// BUSES
export const buses = createTable("bus", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  model: d.varchar({ length: 255 }).notNull(),
  busNumber: d.varchar({ length: 10 }).notNull().unique(),
  routeName: d.varchar({ length: 255 }),
  driverName: d.varchar({ length: 255 }).notNull(),
  driverPhone: d.varchar({ length: 15 }).notNull(),

  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
}));

// export const busesBusNumberRouteIdx = index("buses_bus_number_idx").on(
//   buses.busNumber,
//   buses.routeName,
// );
