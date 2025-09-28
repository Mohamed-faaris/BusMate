import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { buses } from "@/server/db/schema/buses";
import { boardingPoints } from "@/server/db/schema/boardingPoints";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
});

/**
 * Retrieve a user's detailed record by userId, including associated bus and boarding point data.
 *
 * @param params - An object (resolved from route params) containing `userId`, the ID of the user to fetch
 * @returns A NextResponse with `{ success: true, user }` and status 200 when the user is found; a 404 response with `{ error: "User not found" }` when no user matches; or a 500 response with `{ error: "Internal server error" }` on unexpected errors
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
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
          modelID: buses.modelId,
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

/**
 * Updates a user's profile (name, email, phone) for the specified `userId` after authenticating the caller.
 *
 * @returns A JSON HTTP response with one of the following shapes:
 * - Success (200): `{ success: true, message: "Profile updated successfully", user }` where `user` is the updated user record.
 * - Validation error (400): `{ error: "Invalid input", details }` with Zod validation details.
 * - Unauthorized (401): `{ error: "Unauthorized" }` when authentication fails.
 * - Not found (404): `{ error: "User not found" }` when no user matches `userId`.
 * - Server error (500): `{ error: "Internal server error" }` on unexpected failures.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  try {
    const body: unknown = await request.json();
    const parseResult = updateUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const { name, email, phone } = parseResult.data;

    // Update user details
    const result = await db
      .update(users)
      .set({
        name,
        email,
        phone,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: result[0],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
