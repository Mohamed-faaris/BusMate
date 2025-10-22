import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { buses } from "@/server/db/schema/buses";
import { boardingPoints } from "@/server/db/schema/boardingPoints";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        id: users.id,
        rollNo: users.rollNo,
        name: users.name,
        email: users.email,
        gender: users.gender,
        phone: users.phone,
        address: users.address,
        dateOfBirth: users.dateOfBirth,
        college: users.college,
        receiptId: users.receiptId,
        isVerified: users.isVerified,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        bus: {
          id: buses.id,
          busNumber: buses.busNumber,
          routeName: buses.routeName,
        },
        boardingPoint: {
          id: boardingPoints.id,
          name: boardingPoints.name,
        },
      })
      .from(users)
      .leftJoin(buses, eq(users.busId, buses.id))
      .leftJoin(boardingPoints, eq(users.boardingPointId, boardingPoints.id))
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}