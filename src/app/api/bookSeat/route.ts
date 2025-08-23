import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { buses, seats, users, type BusModelProperties, type SeatStatus } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { seatId, busId } = await req.json();

    if (!seatId) {
      return NextResponse.json(
        { error: "seatId is required" },
        { status: 400 },
      );
    }
    if (!busId) {
      return NextResponse.json({ error: "busId is required" }, { status: 400 });
    }
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    db.transaction(async (tx) => {
      const user = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.user?.id));
      if (!user) {
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

    });
    return NextResponse.json({ user }, { status: 200 });
    // const updatedSeat = await db
    //   .update(seats)
    //   .set({ seatStatus: newStatus })
    //   .where(eq(seats.id, seatId))
    //   .returning();

    // if (updatedSeat.length === 0) {
    //   return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    // }

    // return NextResponse.json({
    //   message: "Seat status updated successfully",
    //   seat: updatedSeat[0],
    // });
  } catch (error) {
    console.error("Error updating seat status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
