import { type NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { accounts } from "@/server/db/schema/accounts";
import bcrypt from "bcryptjs";
import { isDev } from "@/lib/utils";
import { getValue } from "@/server/redis/utils";

type UniqueConstraintError = {
  code?: string;
  detail?: string;
};

const isUniqueConstraintError = (error: unknown): error is UniqueConstraintError => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const { code } = error as UniqueConstraintError;
  return code === "23505";
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: unknown = await request.json();

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
      boardingPoint: boardingPointId,
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
    const storedOtp = (await getValue(`otp:${normalizedEmail}`));
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
          boardingPointId,
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
    if (isUniqueConstraintError(error)) {
      // Unique constraint violation
      let field = "Field";
      const detail = error.detail ?? "";
      if (detail.includes("email")) {
        field = "Email";
      } else if (detail.includes("roll_no")) {
        field = "Roll No";
      }
      return NextResponse.json(
        {
          error: "Conflict",
          message: `${field} already in use`,
          buttonMessage: `${field} already in use`,
        },
        { status: 409 },
      );
    }
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
