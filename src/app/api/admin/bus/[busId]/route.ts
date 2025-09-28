import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { buses, seats, users, models } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ busId: string }> },
) {
  try {
    const busId = (await params).busId;

    // Get bus details with model
    const busResult = await db
      .select()
      .from(buses)
      .leftJoin(models, eq(models.id, buses.modelId))
      .where(eq(buses.id, busId))
      .limit(1);

    if (!busResult || busResult.length === 0) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Get all users who are assigned to this bus (actual passengers)
    const passengers = await db
      .select({
        seatId: users.receiptId, // This might contain seat info, or we need to join with seats table
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
        userRollNo: users.rollNo,
        userGender: users.gender,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.busId, busId));

    // Also get seat bookings from seats table if they exist
    const seatBookings = await db
      .select({
        seatId: seats.seatId,
        status: seats.status,
        userId: seats.userId,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
        userRollNo: users.rollNo,
        userGender: users.gender,
        createdAt: seats.createdAt,
      })
      .from(seats)
      .leftJoin(users, eq(seats.userId, users.id))
      .where(eq(seats.busId, busId));

    return NextResponse.json(
      {
        success: true,
        data: {
          bus: busResult[0],
          passengers: passengers,
          seatBookings: seatBookings,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching seat details:", error);
    return NextResponse.json(
      { error: "Error fetching seat details" },
      { status: 500 },
    );
  }
}
