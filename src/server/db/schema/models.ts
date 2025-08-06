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
export interface SeatColumns {
  height?: number;
  seatIds: SeatRows[];
}

export interface BusComponents {
  height?: number;
}

export interface BusModelProperties {
  leftTopSeatColumns: SeatColumns;
  door?: BusComponents;
  leftSeatColumns: SeatColumns;
  rightSeatColumns: SeatColumns;
  driver?: BusComponents;
  backSeats: SeatColumns;
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
    model: d.varchar({ length: 255 }).notNull(),
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
