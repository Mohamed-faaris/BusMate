import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

// BUS BOARDING POINTS
export const busBoardingPoints = createTable("busBoardingPoint", (d) => ({
  id: d.serial().primaryKey().notNull(),
  busId: d.varchar({ length: 255 }).notNull(),
  boardingPointId: d.varchar({ length: 255 }).notNull(),
  arrivalTime: d.timestamp({ mode: "date", withTimezone: true }),
}));
