import { auth } from "@/server/auth";
import { db } from "@/server/db";
import {
  buses,
  seats,
  users,
  boardingPoints,
  type SeatStatus,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingConfirmation } from "@/server/mailer";

const bookSeatSchema = z.object({
  seatId: z.string().min(1, "Seat ID is required"),
  busId: z.string().min(1, "Bus ID is required"),
});

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
    let bookedDetails: {
      id: string;
      email: string;
      name: string;
      boardingPointName?: string | null;
      bus?: {
        id: string;
        busNumber?: string | null;
        routeName?: string | null;
        driverName?: string | null;
        driverPhone?: string | null;
      };
    } | null = null;

    await db.transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.user?.id ?? ""));

      if (!user) {
        console.warn("User not found for id:", session.user?.id);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      // capture minimal user info to send email after transaction commits
      bookedDetails = { id: user.id, email: user.email, name: user.name };
      // fetch bus details to include in the confirmation
      const [busRecord] = await tx
        .select()
        .from(buses)
        .where(eq(buses.id, busId));
      if (busRecord) {
        bookedDetails.bus = {
          id: String(busRecord.id),
          busNumber: busRecord.busNumber ?? null,
          routeName: busRecord.routeName ?? null,
          driverName: busRecord.driverName ?? null,
          driverPhone: busRecord.driverPhone ?? null,
        };
      }
      // fetch boarding point name if user has one
      if (user.boardingPointId) {
        const [bp] = await tx
          .select()
          .from(boardingPoints)
          .where(eq(boardingPoints.id, user.boardingPointId));
        bookedDetails.boardingPointName = bp?.name ?? null;
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
    // Send booking confirmation email if we have user info
    try {
      if (bookedDetails?.email) {
        await sendBookingConfirmation(bookedDetails.email, {
          name: bookedDetails.name,
          seatId,
          busId,
          bus: bookedDetails.bus,
          boardingPointName: bookedDetails.boardingPointName,
        });
      }
    } catch (err) {
      console.error("Error sending booking confirmation email:", err);
    }
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
      console.warn(
        "User has already booked a seat:",
        (error as { detail?: string }).detail,
      );
      return NextResponse.json({ error: "already booked" }, { status: 406 });
    }
    console.error("Error updating seat status:", error);
    return NextResponse.json({ error: "Failed to Book" }, { status: 400 });
  }
}
