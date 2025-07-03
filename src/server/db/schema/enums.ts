import { pgEnum } from "drizzle-orm/pg-core";

// ENUMS
export const genderEnum = pgEnum("gender", ["male", "female"]);
export const seatStatusEnum = pgEnum("seatStatus", [
  "available",
  "booked",
  "reserved",
]);
