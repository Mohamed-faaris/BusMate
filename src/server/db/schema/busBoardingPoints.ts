import { boardingPoints } from "./boardingPoints";
import { createTable } from "./table";

// BUS BOARDING POINTS
export const busBoardingPoints = createTable("busBoardingPoint", (d) => ({
  id: d.serial().primaryKey().notNull(),
  busId: d.varchar({ length: 255 }).notNull(),
  boardingPointId: d.varchar({ length: 255 }).notNull().references(() => boardingPoints.id),
  arrivalTime: d.timestamp({ mode: "date", withTimezone: true }),
}));
