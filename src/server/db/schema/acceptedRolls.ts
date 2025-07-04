import { index } from "drizzle-orm/pg-core";
import { boardingPoints } from "./boardingPoints";
import { createTable } from "./table";

// ACCEPTED ROLLS
export const acceptedRolls = createTable(
  "acceptedRolls",
  (d) => ({
    rollNo: d.varchar({ length: 10 }).notNull().unique(),
    boardingPointId: d
      .uuid()
      .notNull()
      .references(() => boardingPoints.id),
  }),
  (table) => [
    index("acceptedRollsTbRollNo_idx").on(table.rollNo),
    index("acceptedRollsTbBoardingPointId_idx").on(table.boardingPointId),
  ],
);
