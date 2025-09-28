import { auth } from "@/server/auth";
import { db } from "@/server/db";
import {
  buses,
  seats,
  users,
  type SeatStatus,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookSeatSchema = z.object({
  seatId: z.string().min(1, "Seat ID is required"),
  busId: z.string().min(1, "Bus ID is required"),
});

/**
 * Handle a seat booking request for a bus and return a JSON HTTP response.
 *
 * Validates the request body, authenticates the user, records the seat booking,
 * and updates the bus's seat status. Responses cover validation errors, auth
 * failures, not-found conditions, duplicate bookings, and general failures.
 *
 * @returns A JSON HTTP response: on success `{ message: "success" }` with status `200`; on invalid input `{ error: "Invalid input", details }` or other failures `{ error: string }` with status `400`; `401` for unauthorized; `404` if the user is not found; `406` if the user has already booked a seat.
export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parseResult = bookSeatSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const { seatId, busId } = parseResult.data;
    console.log("Received booking request", { seatId, busId });

    if (!seatId) {
      console.warn("Missing seatId in request body");
      return NextResponse.json(
        { error: "seatId is required" },
        { status: 400 },
      );
    }
    if (!busId) {
      console.warn("Missing busId in request body");
      return NextResponse.json({ error: "busId is required" }, { status: 400 });
    }
    const session = await auth();
    console.log("Session info:", session);
    if (!session?.user) {
      console.warn("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db.transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.user?.id ?? ""));

      if (!user) {
        console.warn("User not found for id:", session.user?.id);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const seatStatus: SeatStatus =
        user.gender === "male" ? "bookedMale" : "bookedFemale";

      await tx.insert(seats).values({
        busId,
        seatId,
        userId: user.id,
        status: seatStatus,
      });

      await tx
        .update(buses)
        .set({
          seats: sql`jsonb_set(seats::jsonb, ARRAY[${seatId}]::text[], to_jsonb(${seatStatus}::text))`,
        })
        .where(eq(buses.id, busId));
    });
    console.log("Seat booking successful");
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error: unknown) {
    // Handle unique constraint violation (already booked)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "constraint_name" in error &&
      error.code === "23505" &&
      error.constraint_name === "BusMate_seat_userId_unique"
    ) {
      console.warn("User has already booked a seat:", (error as { detail?: string }).detail);
      return NextResponse.json({ error: "already booked" }, { status: 406 });
    }
    console.error("Error updating seat status:", error);
    return NextResponse.json({ error: "Failed to Book" }, { status: 400 });
  }
}
