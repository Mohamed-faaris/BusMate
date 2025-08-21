import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";

export interface Seat {
  id: string;
  seatStatus?:
    | "available"
    | "bookedMale"
    | "bookedFemale"
    | "reserved"
    | "unavailable";
}
export type SeatRows = Seat[];
export interface SeatGroups {
  height?: number;
  seatsRows: SeatRows[];
}

export interface BusComponents {
  height?: number;
}

export interface BusModelProperties {
  leftTopSeatColumns: SeatGroups;
  door?: BusComponents;
  leftSeatColumns: SeatGroups;
  rightSeatColumns: SeatGroups;
  driver?: BusComponents;
  backSeats: SeatGroups;
}
// MODELS
export const models = createTable(
  "model",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    model: d.varchar({ length: 255 }).notNull().unique(),
    data: d.json("data").notNull(),

    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
  }),
  (table) => [index("model_idx").on(table.model)],
);
