import { type NextRequest, NextResponse } from "next/server";
import { sendSchema } from "@/schemas/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get email and rollNo
    const body: unknown = await request.json();

    // Validate the input
    const validationResult = sendSchema.safeParse(body);

    // if(isDev && !validationResult.success) {
    //     console.error("Validation error:", validationResult.error.issues);
    // }

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
          buttonMessage: "Fix input data",
        },
        { status: 400 },
      );
    }

    const { email, rollNo } = validationResult.data;

    // Normalize fields to lowercase
    const normalizedEmail = email.toLowerCase();
    const normalizedRollNo = rollNo.toLowerCase();

    // Check if email or rollNo already exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.rollNo, rollNo)))
      .limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0]!;
      let conflictField = "";

      if (user.email === normalizedEmail && user.rollNo === normalizedRollNo) {
        conflictField = "Both email and roll number";
      } else if (user.email === email) {
        conflictField = "Email";
      } else if (user.rollNo === rollNo) {
        conflictField = "Roll number";
      }

      return NextResponse.json(
        {
          error: "User already exists",
          message: `${conflictField} already exists in the database`,
          field:
            user.email === normalizedEmail
              ? user.rollNo === rollNo
                ? "both"
                : "email"
              : "rollNo",
          buttonMessage: `${conflictField} already exists`,
        },
        { status: 409 },
      );
    }

    // If email and rollNo are valid and don't exist, proceed with sending
    return NextResponse.json(
      {
        success: true,
        message: "Email and Roll No are valid and available",
        email: normalizedEmail,
        rollNo: normalizedRollNo,
        buttonMessage: "Continue",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Send validation error:", error);
    return NextResponse.json(
      { error: "Invalid request format", buttonMessage: "Invalid request" },
      { status: 400 },
    );
  }
}
