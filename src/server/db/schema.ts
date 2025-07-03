import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, pgEnum } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `BusMate_${name}`);

// ENUMS
export const genderEnum = pgEnum("gender", ["male", "female"]);
export const seatStatusEnum = pgEnum("seatStatus", [
  "available",
  "booked",
  "reserved",
]);

// BUSES
export const buses = createTable("bus", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  model: d.varchar({ length: 255 }).notNull(),
  busNumber: d.varchar({ length: 10 }).notNull().unique(),
  routeName: d.varchar({ length: 255 }).notNull(),
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

// BOARDING POINTS
export const boardingPoints = createTable("boardingPoint", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  latitude: d.doublePrecision(),
  longitude: d.doublePrecision(),
}));

// BUS BOARDING POINTS
export const busBoardingPoints = createTable("busBoardingPoint", (d) => ({
  id: d.serial().primaryKey().notNull(),
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

// USERS
export const users = createTable("user", (d) => ({
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
  busId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => buses.id),
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

export const usersRelations = relations(users, ({ one }) => ({
  bus: one(buses, { fields: [users.busId], references: [buses.id] }),
  boardingPoint: one(boardingPoints, {
    fields: [users.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

// ACCOUNTS
export const accounts = createTable("account", (d) => ({
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  password: d.varchar({ length: 255 }).notNull(),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// ACCEPTED ROLLS
export const acceptedRolls = createTable("acceptedRolls", (d) => ({
  rollNo: d.varchar({ length: 10 }).notNull().unique(),
  boardingPointId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => boardingPoints.id),
}));

export const acceptedRollsRelations = relations(acceptedRolls, ({ one }) => ({
  boardingPoint: one(boardingPoints, {
    fields: [acceptedRolls.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

// SEATS
export const seats = createTable("seat", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  busId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => buses.id),
  status: seatStatusEnum("status").default("available"),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$defaultFn(() => sql`now()`),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  bus: one(buses, { fields: [seats.busId], references: [buses.id] }),
  user: one(users, { fields: [seats.userId], references: [users.id] }),
}));

export const boardingPointsRelations = relations(
  boardingPoints,
  ({ many }) => ({
    users: many(users),
    acceptedRolls: many(acceptedRolls),
    buses: many(busBoardingPoints),
  }),
);

export const busesRelations = relations(buses, ({ many }) => ({
  users: many(users),
  seats: many(seats),
  boardingPoints: many(busBoardingPoints),
}));

// INDEXES
// export const busesBusNumberIdx = index("buses_bus_number_idx").on(
//   buses.busNumber,
// );

// export const busesRouteNameIdx = index("buses_route_name_idx").on(
//   buses.routeName,
// );

// export const boardingPointsNameIdx = index("boarding_points_name_idx").on(
//   boardingPoints.name,
// );

// export const usersRollNoIdx = index("users_roll_no_idx").on(users.rollNo);

// export const usersEmailIdx = index("users_email_idx").on(users.email);

// export const usersBusIdIdx = index("users_bus_id_idx").on(users.busId);

// export const accountsUserIdIdx = index("accounts_user_id_idx").on(
//   accounts.userId,
// );

// export const rollNoIdx = index("accepted_roll_no_idx").on(acceptedRolls.rollNo);

// export const seatsBusIdIdx = index("seats_bus_id_idx").on(seats.busId);

// export const seatsUserIdIdx = index("seats_user_id_idx").on(seats.userId);
