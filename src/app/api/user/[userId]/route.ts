import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { buses } from "@/server/db/schema/buses";
import { boardingPoints } from "@/server/db/schema/boardingPoints";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
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
        receiptId: users.receiptId,
        isVerified: users.isVerified,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        bus: {
          id: buses.id,
          model: buses.model,
          busNumber: buses.busNumber,
          routeName: buses.routeName,
          driverName: buses.driverName,
          driverPhone: buses.driverPhone,
          createdAt: buses.createdAt,
          updatedAt: buses.updatedAt,
        },
        boardingPoint: {
          id: boardingPoints.id,
          name: boardingPoints.name,
          latitude: boardingPoints.latitude,
          longitude: boardingPoints.longitude,
        },
      })
      .from(users)
      .leftJoin(buses, eq(users.busId, buses.id))
      .leftJoin(boardingPoints, eq(users.boardingPointId, boardingPoints.id))
      .where(eq(users.id, userId))
      .limit(1);

    const user = result[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("User detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
