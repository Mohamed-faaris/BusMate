import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, pgEnum } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

export const genderEnum = pgEnum("genderEnum", ["male", "female"]);

//user table
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  rollNo: d.varchar({ length: 10 }).notNull().unique(),
  name: d.varchar({ length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  phone: d.varchar({ length: 15 }).notNull(),
  address: d.varchar({ length: 255 }).notNull(),
  dateOfBirth: d.timestamp({ mode: "date", withTimezone: true }).notNull(),

  busId: d
    .varchar({ length: 255 })
    .references(() => buses.id)
    .notNull(),
  seatId: d.varchar({ length: 255 }).notNull(),
  boardingPointId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => boardingPoints.id),
  receiptId: d.varchar({ length: 255 }).notNull(),
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
}));

export const usersRollEmailBusIdx = index("users_roll_email_bus_idx").on(
  users.rollNo,
  users.email,
  users.busId,
);

export const usersRelations = relations(users, ({ one }) => ({
  bus: one(buses, { fields: [users.busId], references: [buses.id] }),
  seat: one(seats, { fields: [users.seatId], references: [seats.id] }),
  boardingPoint: one(boardingPoints, {
    fields: [users.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

export const accounts = createTable("account", (d) => ({
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  password: d.varchar({ length: 255 }).notNull(),
}));

export const accountsUserIdIdx = index("accounts_user_id_idx").on(
  accounts.userId,
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const acceptedRolls = createTable("acceptedRolls", (d) => ({
  rollNo: d.varchar({ length: 10 }).notNull().unique(),
  boardingPointId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => boardingPoints.id),
}));

export const rollNoIdx = index("accepted_roll_no_idx").on(acceptedRolls.rollNo);

export const acceptedRollsRelations = relations(acceptedRolls, ({ one }) => ({
  boardingPoint: one(boardingPoints, {
    fields: [acceptedRolls.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

export const buses = createTable("bus", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  model: d.varchar({ length: 255 }).notNull(),

  busNumber: d.varchar({ length: 10 }).notNull().unique(),
  routeName: d.varchar({ length: 255 }),
  driverName: d.varchar({ length: 255 }).notNull(),
  driverPhone: d.varchar({ length: 15 }).notNull(),

  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
}));

export const busesBusNumberRouteIdx = index("buses_bus_number_idx").on(
  buses.busNumber,
  buses.routeName,
);

export const busesRelations = relations(buses, ({ many }) => ({
  seats: many(seats),
  boardingPoints: many(busBoardingPoints),
  users: many(users),
}));

export const seatStatusEnum = pgEnum("seatStatus", [
  "available",
  "booked",
  "reserved",
]);

export const seats = createTable("seat", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  busId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => buses.id),
  status: seatStatusEnum("status").default("available"),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  bus: one(buses, { fields: [seats.busId], references: [buses.id] }),
  user: one(users, { fields: [seats.userId], references: [users.id] }),
}));

export const userBusIdx = index("user_bus_idx").on(users.busId, users.id);

export const boardingPoints = createTable("boardingPoint", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  latitude: d.doublePrecision(),
  longitude: d.doublePrecision(),
}));

export const boardingPointsNameIdx = index("boarding_points_name_idx").on(
  boardingPoints.name,
);

export const boardingPointsRelations = relations(
  boardingPoints,
  ({ many }) => ({
    buses: many(busBoardingPoints),
    acceptedRolls: many(acceptedRolls),
    users: many(users),
  }),
);

export const busBoardingPoints = createTable("busBoardingPoint", (d) => ({
  id: d.serial().notNull().primaryKey(),
  busId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => buses.id),
  boardingPointId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => boardingPoints.id),
  arrivalTime: d.timestamp({ mode: "date", withTimezone: true }),
}));

export const busBoardingPointsRelations = relations(
  busBoardingPoints,
  ({ one }) => ({
    bus: one(buses, {
      fields: [busBoardingPoints.busId],
      references: [buses.id],
    }),
    boardingPoint: one(boardingPoints, {
      fields: [busBoardingPoints.boardingPointId],
      references: [boardingPoints.id],
    }),
  }),
);
