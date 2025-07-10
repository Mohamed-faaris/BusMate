import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { accounts } from "@/server/db/schema/accounts";
import { boardingPoints } from "@/server/db/schema/boardingPoints";
import { buses } from "@/server/db/schema/buses";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the input
    const validationResult = registrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      rollNo,
      name,
      email,
      boardingPoint,
      gender,
      phone,
      address,
      dateOfBirth,
      otp,
      password,
    } = validationResult.data;

    // Check if OTP is correct
    if (otp !== "123123") {
      return NextResponse.json(
        {
          error: "Invalid OTP",
          message: "The OTP you entered is incorrect",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: "User already exists",
          message: "A user with this email already exists",
        },
        { status: 409 }
      );
    }

    // Check if roll number already exists
    const existingRollNo = await db
      .select()
      .from(users)
      .where(eq(users.rollNo, rollNo))
      .limit(1);

    if (existingRollNo.length > 0) {
      return NextResponse.json(
        {
          error: "Roll number already exists",
          message: "A user with this roll number already exists",
        },
        { status: 409 }
      );
    }

    // Find boarding point by name
    const boardingPointResult = await db
      .select()
      .from(boardingPoints)
      .where(eq(boardingPoints.name, boardingPoint))
      .limit(1);

    if (boardingPointResult.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid boarding point",
          message: "The selected boarding point does not exist",
        },
        { status: 400 }
      );
    }

    // For now, we'll assign the first available bus
    // In a real application, this would be based on boarding point and other criteria
    const availableBuses = await db.select().from(buses).limit(1);

    if (availableBuses.length === 0) {
      return NextResponse.json(
        {
          error: "No buses available",
          message: "No buses are currently available for registration",
        },
        { status: 500 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user and account in a transaction
    const result = await db.transaction(async (tx) => {
      // Create the user
      const newUsers = await tx
        .insert(users)
        .values({
          rollNo,
          name,
          email,
          gender: gender as "male" | "female" | "other",
          phone,
          address,
          dateOfBirth: new Date(dateOfBirth),
          boardingPointId: boardingPointResult[0]!.id,
          busId: availableBuses[0]!.id,
          receiptId: `RCP-${Date.now()}-${rollNo}`, // Generate a simple receipt ID
          isVerified: true, // Since OTP is verified
        })
        .returning();

      const newUser = newUsers[0]!;

      // Create the account with password
      await tx.insert(accounts).values({
        userId: newUser.id,
        password: hashedPassword,
      });

      return newUser;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          id: result.id,
          rollNo: result.rollNo,
          name: result.name,
          email: result.email,
          receiptId: result.receiptId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
