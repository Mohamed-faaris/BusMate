import { index } from "drizzle-orm/pg-core";
import { boardingPoints } from "./boardingPoints";
import { createTable } from "./table";

// BUS BOARDING POINTS
export const busBoardingPoints = createTable(
  "busBoardingPoint",
  (d) => ({
    id: d.serial().primaryKey().notNull(),
    busId: d.uuid().notNull(),
    boardingPointId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => boardingPoints.id),
    arrivalTime: d.timestamp({ mode: "date", withTimezone: true }),
  }),
  (table) => [
    index("BPbusId_idx").on(table.busId),
    index("boardingPointId_idx").on(table.boardingPointId),
  ],
);
