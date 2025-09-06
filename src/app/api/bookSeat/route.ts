import { auth } from "@/server/auth";
import { db } from "@/server/db";
import {
  buses,
  seats,
  users,
  type BusModelProperties,
  type SeatStatus,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seatId, busId } = await req.json();
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
        .where(eq(users.id, session.user?.id || ""));

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
        seatStatus,
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
  } catch (error: any) {
    // Handle unique constraint violation (already booked)
    if (
      error?.code === "23505" &&
      error?.constraint_name === "BusMate_seat_userId_unique"
    ) {
      console.warn("User has already booked a seat:", error.detail);
      return NextResponse.json({ error: "already booked" }, { status: 406 });
    }
    console.error("Error updating seat status:", error.constraint_name);
    return NextResponse.json(
      { error: "Failed to Book" },
      { status: 400 },
    );
  }
}
