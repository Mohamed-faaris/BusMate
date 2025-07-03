import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

// ACCEPTED ROLLS
export const acceptedRolls = createTable("acceptedRolls", (d) => ({
  rollNo: d.varchar({ length: 10 }).notNull().unique(),
  boardingPointId: d.varchar({ length: 255 }).notNull(),
}));

//export const rollNoIdx = index("accepted_roll_no_idx").on(acceptedRolls.rollNo);
