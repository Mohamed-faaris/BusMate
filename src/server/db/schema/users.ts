import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { collegeEnum, genderEnum } from "./enums";
import { boardingPoints } from "./boardingPoints";
import { buses } from "./buses";
import { createTable } from "./table";

// USERS
export const users = createTable(
  "user",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    rollNo: d.varchar({ length: 10 }).notNull().unique(),
    name: d.varchar({ length: 255 }).notNull(),
    gender: genderEnum("gender").notNull(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    phone: d.varchar({ length: 15 }).notNull(),
    address: d.varchar({ length: 255 }).notNull(),
    dateOfBirth: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
    college: collegeEnum("college").notNull(),

    busId: d
      .uuid()
      .references(() => buses.id),

    boardingPointId: d
      .uuid()
      .references(() => boardingPoints.id),
    receiptId: d.varchar({ length: 255 }),

    isVerified: d.boolean().notNull().default(false),
    isAdmin: d.boolean().notNull().default(false),

    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .$defaultFn(() => sql`now()`),
  }),
  (table) => [
    index("rollNo_idx").on(table.rollNo),
    index("email_idx").on(table.email),
    index("busId_idx").on(table.busId),
    
  ],
);
