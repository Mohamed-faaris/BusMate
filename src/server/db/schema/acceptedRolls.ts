import { index } from "drizzle-orm/pg-core";
import { boardingPoints } from "./boardingPoints";
import { createTable } from "./table";

// ACCEPTED ROLLS
export const acceptedRolls = createTable(
  "acceptedRolls",
  (d) => ({
    rollNo: d.varchar({ length: 10 }).notNull().unique(),
    boardingPointId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => boardingPoints.id),
  }),
  (table) => [
    index("rollNo_idx").on(table.rollNo),
    index("boardingPointId_idx").on(table.boardingPointId),
  ],
);
