import { type NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { accounts } from "@/server/db/schema/accounts";
import { boardingPoints } from "@/server/db/schema/boardingPoints";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { isDev } from "@/lib/utils";
import { getValue } from "@/server/redis/utils";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the input
    const validationResult = registrationSchema.safeParse(body);

    if (isDev && !validationResult.success) {
      console.error("Validation error:", validationResult.error.issues);
    }

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
          buttonMessage: "Fix form errors",
        },
        { status: 400 },
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
      college,
    } = validationResult.data;

    // Normalize fields to lowercase
    const normalizedEmail = email.toLowerCase();
    const normalizedRollNo = rollNo.toLowerCase();

    // Check if OTP is correct
    const storedOtp = await getValue(`otp:${normalizedEmail}`);
    if (otp !== storedOtp) {
      return NextResponse.json(
        {
          error: "Invalid OTP",
          message: "The OTP you entered is incorrect",
          buttonMessage: "Invalid OTP",
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: "User already exists",
          message: "A user with this email already exists",
          buttonMessage: "Email already taken",
        },
        { status: 409 },
      );
    }

    // Check if roll number already exists
    const existingRollNo = await db
      .select()
      .from(users)
      .where(eq(users.rollNo, normalizedRollNo))
      .limit(1);

    if (existingRollNo.length > 0) {
      return NextResponse.json(
        {
          error: "Roll number already exists",
          message: "A user with this roll number already exists",
          buttonMessage: "Roll number taken",
        },
        { status: 409 },
      );
    }

    // Find boarding point by name
    const [boardingPointRecord] = await db
      .select()
      .from(boardingPoints)
      .where(eq(boardingPoints.name, boardingPoint))
      .limit(1);

    if (!boardingPointRecord) {
      return NextResponse.json(
        {
          error: "Invalid boarding point",
          message: "The selected boarding point does not exist",
          buttonMessage: "Invalid stop selected",
        },
        { status: 400 },
      );
    }

    // For now, we'll assign the first available bus
    // In a real application, this would be based on boarding point and other criteria

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user and account in a transaction
    const result = await db.transaction(async (tx) => {
      // Create the user
      const newUsers = await tx
        .insert(users)
        .values({
          rollNo: normalizedRollNo,
          name,
          email: normalizedEmail,
          college,
          gender,
          phone,
          address,
          dateOfBirth: new Date(dateOfBirth),
          boardingPointId: boardingPointRecord.id,
          busId: null,
          receiptId: null, // Generate a simple receipt ID
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
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred during registration",
        buttonMessage: "Server error",
      },
      { status: 500 },
    );
  }
}
