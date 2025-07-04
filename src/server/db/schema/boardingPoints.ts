import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";

// BOARDING POINTS
export const boardingPoints = createTable(
  "boardingPoint",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.varchar({ length: 255 }).notNull(),
    latitude: d.doublePrecision(),
    longitude: d.doublePrecision(),
  }),
  (table) => [index("name_idx").on(table.name)],
);
