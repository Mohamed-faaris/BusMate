import { relations } from "drizzle-orm";
import { users } from "./users";
import { buses } from "./buses";
import { boardingPoints } from "./boardingPoints";
import { busBoardingPoints } from "./busBoardingPoints";
import { accounts } from "./accounts";
import { seats } from "./seats";
import { acceptedRolls } from "./acceptedRolls";
import { models } from "./models";

export const usersRelations = relations(users, ({ one }) => ({
  bus: one(buses, { fields: [users.busId], references: [buses.id] }),
  boardingPoint: one(boardingPoints, {
    fields: [users.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

export const busesRelations = relations(buses, ({ many }) => ({
  users: many(users),
  seats: many(seats),
  boardingPoints: many(busBoardingPoints),
}));

export const boardingPointsRelations = relations(
  boardingPoints,
  ({ many }) => ({
    users: many(users),
    acceptedRolls: many(acceptedRolls),
    buses: many(busBoardingPoints),
  }),
);

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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  bus: one(buses, { fields: [seats.busId], references: [buses.id] }),
  user: one(users, { fields: [seats.userId], references: [users.id] }),
}));

export const acceptedRollsRelations = relations(acceptedRolls, ({ one }) => ({
  boardingPoint: one(boardingPoints, {
    fields: [acceptedRolls.boardingPointId],
    references: [boardingPoints.id],
  }),
}));

export const busModelRelations = relations(buses, ({ one }) => ({
  model: one(models, { fields: [buses.modelId], references: [models.id] }),
}));
