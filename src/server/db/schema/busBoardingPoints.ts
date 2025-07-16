import { index } from "drizzle-orm/pg-core";
import { boardingPoints } from "./boardingPoints";
import { buses } from "./buses";
import { createTable } from "./table";

// BUS BOARDING POINTS
export const busBoardingPoints = createTable(
  "busBoardingPoint",
  (d) => ({
    id: d.serial().primaryKey().notNull(),
    busId: d
      .uuid()
      .notNull()
      .references(() => buses.id),
    boardingPointId: d
      .uuid()
      .notNull()
      .references(() => boardingPoints.id),
    arrivalTime: d.time().notNull(),
  }),
  (table) => [
    index("BPbusId_idx").on(table.busId),
    index("boardingPointId_idx").on(table.boardingPointId),
  ],
);
